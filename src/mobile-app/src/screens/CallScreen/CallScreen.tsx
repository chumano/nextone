import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper'

import { useDispatch, useSelector } from 'react-redux';
import { callActions } from '../../stores/call/callReducer';
import CallService, { CallMessage, CallSignalingActions, CallSignalingEvents } from '../../services/CallService';

//https://medium.com/@skyrockets/react-native-webrtc-video-calling-mobile-application-26223bf87f0d

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import { IAppStore } from '../../stores/app.store';
import { CallMessageData } from '../../types/CallMessageData';
import Loading from '../../components/Loading';
import signalRService from '../../services/SignalRService';

//https://blog.logrocket.com/creating-rn-video-calling-app-react-native-webrtc/

const iceServers = { //change the config as you need{
   iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
};
export const CallScreen = () => {
  const dispatch = useDispatch();
  const { callInfo } = useSelector((store: IAppStore) => store.call);
  const [ isConnected, setConnected] = useState(false);
  const [calling, setCalling] = useState(false);
  // Video Scrs
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [webcamStarted, setWebcamStarted] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection>();

  const hangup = () => {
    console.log('hangup');
    //clear something
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = undefined;
    }

    if (localStream && localStream.active) {
      localStream.getTracks().forEach((track) => { track.stop(); });
    }
    if (remoteStream && remoteStream.active) {
      remoteStream.getTracks().forEach((track) => { track.stop(); });
    }
  }
  useEffect(() => {
    const subscription = signalRService.subscription(
      'connected',
      (data: any) => {
        console.log('[signalRService connected]', data);
        setConnected(true);
      },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = signalRService.subscription(
      CallSignalingEvents.CALL_MESSAGE,
      async (message: CallMessage) => {
        
        switch (message.type) {
          //sender
          case 'call-request-response':
            const { accepted } = message.data;
            if (!accepted) {
              // this.callSender.hangup();
              // this.pubSub.publish(CallEvents.CALL_STOPED);
              return;
            }
            //create offer then send
            const sdp = await peerConnectionRef.current!.createOffer(undefined)
            let finalSdp = sdp as RTCSessionDescription;

            peerConnectionRef.current!.setLocalDescription(finalSdp);
            await signalRService.invoke(
              CallSignalingActions.SEND_SESSION_DESCRIPTION,
              {
                room: callInfo?.conversationId,
                sdp: finalSdp
              }
            );

            break;


          //sender + receiver
          case 'other-session-description':
            {
              console.log("[CALL_MESSAGE] receive-" + message.type)
              const isSender = !!callInfo?.senderId;
              const sdp = message.data;
              if (sdp.type === 'answer' && isSender) {
                peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(sdp));
              } else if (sdp.type === 'offer' && !isSender) {

                peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(sdp));
                const awsSdp = await peerConnectionRef.current!.createAnswer();
                peerConnectionRef.current!.setLocalDescription(awsSdp as any);
                await signalRService.invoke(
                  CallSignalingActions.SEND_SESSION_DESCRIPTION,
                  {
                    room: callInfo?.conversationId,
                    sdp
                  }
                );
              }
              break;
            }

          case 'other-ice-candidate':
            {
              const isSender = !!callInfo?.senderId;
              const candidateResponse = message.data;
              const { label, id, candidate } = message.data;
              //console.log('Adding ice candidate.', message.data);
              if (!candidate) {
                console.log('data.candidate is null');
                return;
              }
              const iceCandidate = new RTCIceCandidate({
                sdpMLineIndex: label,
                candidate: candidate
              });
              peerConnectionRef.current!.addIceCandidate(iceCandidate);

              break;
            }
          case 'other-hangup':
            {
              console.log('other-hangup');
              hangup();
              dispatch(callActions.stopCall());
              break;
            }
        }
      },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const isConnectedS = signalRService.isConnected();
    console.log({callInfo, isConnectedS})
    if (!callInfo || !isConnectedS) return;

    const setupCall = async () => {
      console.log('setupCall............', callInfo);
      try {
        let isFront = true;
        const sourceInfos = await mediaDevices.enumerateDevices() as any[];
        let videoSourceId;
        console.log({ sourceInfos })
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if (
            sourceInfo.kind == 'videoinput' &&
            sourceInfo.facing == (isFront ? 'front' : 'environment')
          ) {
            videoSourceId = sourceInfo.deviceId;
          }
        }
        console.log({ videoSourceId })
        const stream: MediaStream = await mediaDevices.getUserMedia({
          audio: true,
          video: callInfo.callType === 'video' ? {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
          } : false,
        }) as any;

        console.log('Got stream!')
        // Got stream!
        setLocalStream(stream);

        if(peerConnectionRef.current){
          console.log("close old peerConnectionRef")
          peerConnectionRef.current.close();
          peerConnectionRef.current = undefined;
        }

        peerConnectionRef.current = new RTCPeerConnection(iceServers);
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addStream(stream);
        }

        // Push tracks from local stream to peer connection
        console.log("localStream-tracks", stream.getTracks())
        stream.getTracks().forEach(track => {
          console.log('getLocalStreams', peerConnectionRef.current!.getLocalStreams());
          peerConnectionRef.current!.getLocalStreams()[0].addTrack(track);
        });


        const remote = new MediaStream(undefined);
        setRemoteStream(remote);

        // ------setup stream listening-------
        // Pull tracks from remote stream, add to video stream
        peerConnectionRef.current.ontrack = (event: any) => {
          console.log('peerConnectionRef-ontrack', event)
          event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
            remote.addTrack(track);
          });
        };

        peerConnectionRef.current.onaddstream = (event: any) => {
          console.log('peerConnectionRef-onaddstream', event)
          setRemoteStream(event.stream);
        };

        //send answer if this is receiver
        if(callInfo.senderId){
          console.log("send accepted")
          await signalRService.invoke(
            CallSignalingActions.SEND_CALL_REQUEST_RESPONSE,
            {
                room: callInfo.conversationId,
                accepted: true
            }
        );
        }
        setWebcamStarted(true);
        console.log('Success setupCall')
      } catch (err) {
        console.log('[Error] setupCall', err);
      }
    }

    setupCall();

  }, [callInfo,isConnected])

  const stopCall = ()=>{
    console.log("CallScreen-StopCallButton-onPress")
    hangup();
    signalRService.invoke(CallSignalingActions.SEND_HANG_UP,callInfo?.conversationId);
    dispatch(callActions.stopCall());
  }
  if (!callInfo) {
    return <SafeAreaView>
      <Loading />
    </SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text>CallScreen</Text>
      <Button mode="contained"
        onPress={stopCall}
      >
        Stop Call : {callInfo.callType}
      </Button>

      <View style={styles.videoContainer}>
        <View style={[styles.videos, styles.localVideos]}>
          <Text>Your Video</Text>
          {
          <RTCView streamURL={(localStream?.toURL())} style={styles.localVideo} />
          }
        </View>
        <View style={[styles.videos, styles.remoteVideos]}>
          <Text>Friends Video</Text>
          {remoteStream && false &&
            <RTCView streamURL={remoteStream?.toURL()} style={styles.remoteVideo}
            />
          }
          
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  inputField: {
    marginBottom: 10,
    flexDirection: 'column',
  },
  videoContainer: {
    flex: 1,
    minHeight: 450,
  },
  videos: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',

    borderRadius: 6,
  },
  localVideos: {
    height: 100,
    marginBottom: 10,
  },
  remoteVideos: {
    height: 400,
  },
  localVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  remoteVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
});
