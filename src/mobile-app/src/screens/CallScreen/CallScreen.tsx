import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper'

import { useDispatch, useSelector } from 'react-redux';
import { callActions } from '../../stores/call/callReducer';
import CallService, { CallMessage, CallSignalingEvents } from '../../services/CallService';

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
import { ChatData } from '../../stores/conversation/conversation.payloads';

//https://blog.logrocket.com/creating-rn-video-calling-app-react-native-webrtc/
export const CallScreen = () => {
  const dispatch = useDispatch();
  const { callInfo } = useSelector((store: IAppStore) => store.call);
  const [calling, setCalling] = useState(false);
  // Video Scrs
  const [localStream, setLocalStream] = useState({ toURL: () => null });
  const [remoteStream, setRemoteStream] = useState({ toURL: () => null });

  const [peerConnection, setPeerConnection] = useState(
    //change the config as you need
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        }, {
          urls: 'stun:stun1.l.google.com:19302',
        }, {
          urls: 'stun:stun2.l.google.com:19302',
        }

      ],
    }),
  );

  useEffect(() => {
    const subscription = signalRService.subscription(
      CallSignalingEvents.CALL_MESSAGE,
      (message: CallMessage) => {
        console.log("[CALL_MESSAGE] receive-"+ message.type, message.data)
        switch (message.type) {
            //sender
            case 'call-request-response':
                const { accepted } = message.data;
                if (!accepted) {
                    // this.callSender.hangup();
                    // this.pubSub.publish(CallEvents.CALL_STOPED);
                    return;
                }
                //this.callSender.sendOffer();

                break;
           

            //sender + receiver
            case 'other-session-description':
                {
                    const sdp = message.data;
                    // if (sdp.type === 'answer' && this.isSender) {
                    //     this.callSender.receiveAnswer(sdp);
                    // }else if (sdp.type === 'offer' && !this.isSender) {
                    //     this.callReceiver.receiveOffer(sdp);
                    // }
                    break;
                }

            case 'other-ice-candidate':
                {
                    const candidateResponse = message.data;
                    const { label, id, candidate } = message.data;
                    // if (this.isSender) {
                    //     this.callSender.addIceCandidate(candidateResponse);
                    // } else {
                    //     this.callReceiver.addIceCandidate(candidateResponse);
                    // }

                    break;
                }
            case 'other-hangup':
                {
                    // console.log('other-hangup');
                    // this.stopCall();
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
    if (!callInfo) return;

    const setupCall = async () => {
      try{
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
        const stream = await mediaDevices.getUserMedia({
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
  
        // setup stream listening
        peerConnection.addStream(stream);
      }catch(err){
        console.log('setCall', err);
      }
    }

    setupCall();

  }, [callInfo])

  if (!callInfo) {
    return <SafeAreaView>
      <Loading />
    </SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text>CallScreen</Text>
      <Button mode="contained"
        onPress={() => {
          console.log("CallScreen-StopCallButton-onPress")
          dispatch(callActions.stopCall());
        }}
      >
        Stop Call : {callInfo.callType}
      </Button>

      <View style={styles.videoContainer}>
        <View style={[styles.videos, styles.localVideos]}>
          <Text>Your Video</Text>
          <RTCView streamURL={(localStream.toURL())} style={styles.localVideo} />
        </View>
        <View style={[styles.videos, styles.remoteVideos]}>
          <Text>Friends Video</Text>
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
          />
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
