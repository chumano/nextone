import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper'

import { useDispatch } from 'react-redux';
import { callActions } from '../../stores/call/callReducer';

//https://medium.com/@skyrockets/react-native-webrtc-video-calling-mobile-application-26223bf87f0d

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView ,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';


export const CallScreen = () => {
  const dispatch = useDispatch();
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
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa')
    let isFront = false;
    mediaDevices.enumerateDevices().then((sourceInfos: any) => {
      let videoSourceId;
      console.log({sourceInfos})
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      console.log({videoSourceId})
      mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            //facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
          },
        })
        .then((stream: any) => {
          console.log('Got stream!')
          // Got stream!
          setLocalStream(stream);

          // setup stream listening
          peerConnection.addStream(stream);
        })
        .catch(error => {
          // Log error
        });
    });

  }, [])

  return (
    <View style={{ flex: 1 }}>

      <Text>CallScreen</Text>
      <Button mode="contained"
        onPress={() => {
          console.log("CallScreen-StopCallButton-onPress")
          dispatch(callActions.stopCall());
        }}
      >
        Stop Call
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
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
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
