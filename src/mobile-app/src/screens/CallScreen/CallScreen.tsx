import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper'

import { useDispatch, useSelector } from 'react-redux';
import { callActions } from '../../stores/call/callReducer';
import CallService, { CallEvents, CallMessage, CallSignalingActions, CallSignalingEvents } from '../../services/CallService';

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
  const [isConnected, setConnected] = useState(false);
  const [calling, setCalling] = useState(false);
  // Video Scrs
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [webcamStarted, setWebcamStarted] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const iceCadidates = useRef<string[]>([]);

  const hangup = () => {
    console.log('hangup');
    //clear something
    iceCadidates.current = [];
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
      iceCadidates.current = [];
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = signalRService.subscription(
      CallSignalingEvents.CALL_MESSAGE,
      async (message: CallMessage) => {
        try{
          console.log("[CALL_MESSAGE] receive-" + message.type)
          switch (message.type) {
            //sender
            case 'call-request-response':
              const { accepted } = message.data;
              if (!accepted) {
                hangup();
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
                const isSender = !callInfo?.senderId;
                const sdp = message.data;
                console.log('sdp.type', sdp.type, callInfo)
                if (sdp.type === 'answer' && isSender) {
                  peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(sdp));
                } else if (sdp.type === 'offer' && !isSender) {
                  peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(sdp));
  
                  //create answer
                  const awsSdp = await peerConnectionRef.current!.createAnswer();
                  peerConnectionRef.current!.setLocalDescription(awsSdp as any);
                  await signalRService.invoke(
                    CallSignalingActions.SEND_SESSION_DESCRIPTION,
                    {
                      room: callInfo?.conversationId,
                      sdp: awsSdp
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
        }catch(err){
          console.error('CALL_MESSAGE',err)
        }
        
      },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [peerConnectionRef]);

  useEffect(() => {
    const setupCall = async () => {
      
      const isConnectedS = signalRService.isConnected();
      console.log('setupCall............', callInfo, isConnectedS);

      console.log({ callInfo, isConnectedS })
      if (!callInfo || !isConnectedS) return;
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

        // Got stream!
        setLocalStream(stream);
        if (peerConnectionRef.current) {
          console.log("close old peerConnectionRef")
          peerConnectionRef.current.close();
          peerConnectionRef.current = undefined;
        }

        peerConnectionRef.current = new RTCPeerConnection(iceServers);
        peerConnectionRef.current.addStream(stream);

        // Push tracks from local stream to peer connection
        //const localStreams = peerConnectionRef.current.getLocalStreams();
        // stream.getTracks().forEach(track => {
        //   console.log('getLocalStreams', peerConnectionRef.current!.getLocalStreams());
        //   peerConnectionRef.current!.getLocalStreams()[0].addTrack(track);
        // });

        const remote = new MediaStream(undefined);
        //setRemoteStream(undefined);

        // ------setup stream listening-------
        // Pull tracks from remote stream, add to video stream
        // peerConnectionRef.current.ontrack = (event: any) => {
        //   try{
        //     console.log('[peerConnectionRef-ontrack]', event)
        //     event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
        //       remote.addTrack(track);
        //     });
        //   }catch(err){
        //     console.error('[peerConnectionRef-ontrack]',err)
        //   }
        
        // };

        peerConnectionRef.current.onaddstream = (event: any) => {
          try{
            console.log('peerConnectionRef-onaddstream', event)
            setRemoteStream(event.stream);
          }catch(err){
            console.error('peerConnectionRef-onaddstream',err)
          }
         
        };

        //send answer if this is receiver
        if (callInfo.senderId) {
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
    
  }, [callInfo, isConnected, setRemoteStream])

  const stopCall = () => {
    console.log("CallScreen-StopCallButton-onPress")
    hangup();
    signalRService.invoke(CallSignalingActions.SEND_HANG_UP, callInfo?.conversationId);
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
            <RTCView key={(new Date()).toString()} streamURL={(localStream?.toURL())} style={styles.localVideo} />
          }
        </View>
        <View style={[styles.videos, styles.remoteVideos]}>
          <Text>Friends Video</Text>
          {remoteStream&&
            <RTCView key={(new Date()).toString()}  streamURL={remoteStream?.toURL()} style={styles.remoteVideo}
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
