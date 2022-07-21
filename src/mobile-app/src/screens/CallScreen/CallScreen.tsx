import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper'

import { useDispatch, useSelector } from 'react-redux';
import { callActions } from '../../stores/call/callReducer';
import CallService, { CallEvents, CallMessage, CallSignalingActions, CallSignalingEvents } from '../../services/CallService';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
import signalRService, { SignalRService } from '../../services/SignalRService';
import { APP_THEME } from '../../constants/app.theme';

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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [calling, setCalling] = useState(true);
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
    console.log('Call screen open....')
    CallService.isCalling = true;
    setCalling(true);
    const subscription = signalRService.subscription(
      'connected',
      (data: any) => {
        console.log('[signalRService connected]', data);
        setConnected(true);
      },
    );
    return () => {
      CallService.isCalling = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = signalRService.subscription(
      CallSignalingEvents.CALL_MESSAGE,
      async (message: CallMessage) => {
        try{

          console.log("[CALL_MESSAGE] receive-" + message.type)
          
          if(!peerConnectionRef.current) {
            console.log('peerConnectionRef.current is null')
            return;
          }

          switch (message.type) {
            //sender
            case 'call-request-response':
              console.log("[CALL_MESSAGE] receive-" + message.type,  message.data)
              const { accepted } = message.data;
              CallService.isReceiceResponse = true;
              if (!accepted) {
                hangup();
                dispatch(callActions.stopCall());
                return;
              }
              //create offer then send
              const sdp = await peerConnectionRef.current.createOffer(undefined)
              let finalSdp = sdp as RTCSessionDescription;
  
              peerConnectionRef.current!.setLocalDescription(finalSdp);
              await signalRService.invoke(
                CallSignalingActions.SEND_SESSION_DESCRIPTION,
                {
                  room: callInfo?.conversationId,
                  sdp: finalSdp
                }
              );
  
              setCalling(false);
              break;
  
            //sender + receiver
            case 'other-session-description':
              {
                const isSender = !callInfo?.senderId;
                const sdp = message.data;
                console.log('sdp.type', sdp.type, callInfo)
                if (sdp.type === 'answer' && isSender) {
                  peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
                } else if (sdp.type === 'offer' && !isSender) {
                  peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
  
                  //create answer
                  console.log('create answer.......')
                  const awsSdp = await peerConnectionRef.current.createAnswer();
                  peerConnectionRef.current.setLocalDescription(awsSdp as any);
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
                
                peerConnectionRef.current.addIceCandidate(iceCandidate);
  
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
  }, [callInfo]);

  useEffect(() => {
    const setupCall = async () => {
      const isConnectedS = signalRService.isConnected();
      console.log('setupCall............', callInfo, isConnectedS);
      if (!callInfo || !isConnectedS) return;
      setVoiceEnabled(true);
      setVideoEnabled(callInfo.callType === 'video');

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

        // ------setup stream listening-------
        peerConnectionRef.current.onaddstream = (event: any) => {
          try{
            console.log('peerConnectionRef-onaddstream', event)
            setRemoteStream(event.stream);
          }catch(err){
            console.error('peerConnectionRef-onaddstream',err)
          }
         
        };

        peerConnectionRef.current.addEventListener( 'connectionstatechange', (event: any) => {
          console.log('peerConnectionRef-connectionstatechange', event)
          switch( peerConnectionRef.current!.connectionState ) {
            case 'closed':
              // You can handle the call being disconnected here.
        
              break;
          };
        } );
        
        peerConnectionRef.current.addEventListener( 'icecandidate', async (event: any) => {
          console.log('peerConnectionRef-icecandidate', event)
          // When you find a null candidate then there are no more candidates.
          // Gathering of candidates has finished.
          if ( !event.candidate ) { return; };
        
          // Send the event.candidate onto the person you're calling.
          // Keeping to Trickle ICE Standards, you should send the candidates immediately.
          console.log('CallSignalingActions.SEND_ICE_CANDIDATE')
          await signalRService.invoke(CallSignalingActions.SEND_ICE_CANDIDATE, {
            room: callInfo.conversationId,
            iceCandidate: {
                type: 'candidate',
                label: event?.candidate?.sdpMLineIndex,
                id: event?.candidate?.sdpMid,
                candidate: event?.candidate?.candidate
              }
          });
        } );
        
        peerConnectionRef.current.addEventListener( 'icecandidateerror', (event: any) => {
          console.log('peerConnectionRef-icecandidateerror', event)
          // You can ignore some candidate errors.
          // Connections can still be made even when errors occur.
        } );
        
        peerConnectionRef.current.addEventListener( 'iceconnectionstatechange', (event: any) => {
          console.log('peerConnectionRef-iceconnectionstatechange', {
            iceConnectionState: peerConnectionRef.current?.iceConnectionState,
            event
          });
          if(!peerConnectionRef.current) return;
          switch( peerConnectionRef.current.iceConnectionState ) {
            case 'connected':
            case 'completed':
              // You can handle the call being connected here.
              // Like setting the video streams to visible.
        
              break;
            case 'disconnected':
              hangup();
              dispatch(callActions.stopCall());
              break;
          };
        } );
        
        peerConnectionRef.current.addEventListener( 'negotiationneeded', (event: any) => {
          console.log('peerConnectionRef-negotiationneeded', event)
          if(!peerConnectionRef.current) return;
          // You can start the offer stages here.
          // Be careful as this event can be called multiple times.
        } );
        
        peerConnectionRef.current.addEventListener( 'signalingstatechange', (event: any) => {
          console.log('peerConnectionRef-signalingstatechange', event)
          if(!peerConnectionRef.current) return;
          switch( peerConnectionRef.current.signalingState ) {
            case 'closed':
              // You can handle the call being disconnected here.
        
              break;
          };
        } );

        const isSender = !callInfo.senderId;
        const {callType, conversationId} = callInfo;
        if (isSender && conversationId) {
          console.log("send call request", {
            room : conversationId,
            callType
          })
          
          CallService.isReceiceResponse = false;
          const response = await signalRService.invoke(
            CallSignalingActions.SEND_CALL_REQUEST, 
            {
              room : conversationId,
              callType
            });
          console.log("send call request - response", response);
          setTimeout(()=>{
            if(!CallService.isCalling) return;

            //Nếu không nhận đc phản hồi thì kết thúc
            if(!CallService.isReceiceResponse){
              //end call
              hangup();
              dispatch(callActions.stopCall());
            }
          },15000)
        }
        else {
          //send answer if this is receiver
          console.log("send call accepted")
          const response = await signalRService.invoke(
            CallSignalingActions.SEND_CALL_REQUEST_RESPONSE,
            {
              room: callInfo.conversationId,
              accepted: true
            }
          );
          console.log("send call accepted - response", response)
        }

        setWebcamStarted(true);

        console.log('Success setupCall')
      } catch (err) {
        console.log('[Error] setupCall', err);
      }
    }
    setupCall();
    
  }, [callInfo, isConnected, setRemoteStream])

  useEffect(() => {
    setLocalStream((localStream) => {
        if (localStream) {
            if (localStream.getAudioTracks().length > 0) {
                localStream.getAudioTracks()[0].enabled = voiceEnabled;
            }
            if (localStream.getVideoTracks().length > 0) {
                localStream.getVideoTracks()[0].enabled = videoEnabled;
            }
        }

        return localStream;
    });
  }, [voiceEnabled, videoEnabled])

  const stopCall = async () => {
    console.log("CallScreen-StopCallButton-onPress")

    hangup();
    dispatch(callActions.stopCall());
    try{
      console.log('CallSignalingActions.SEND_HANG_UP', callInfo?.conversationId)
      await signalRService.invoke(CallSignalingActions.SEND_HANG_UP, callInfo?.conversationId);
    }catch(err){
      console.error('CallSignalingActions.SEND_HANG_UP', err)
    }
  }

  const onToogle =( type: 'voice' | 'video')=>{
    return ()=>{
      if (type == 'voice') {
        setVoiceEnabled(s => !s)
      } else {
        setVideoEnabled(s => !s)
      }
    }
  }

  const onSwitchCameras = () => {
    if(!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
        track._switchCamera()
    })
  }
  
  useEffect(() => {
    const backAction = () => {
      console.log('hardwareBackPress')
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (!callInfo) {
    return <SafeAreaView>
      <Loading />
    </SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.root}>
        {/* background */}
        {remoteStream && callInfo.callType === 'video' && 
          <View style={styles.remoteVideoContainer}>
              <RTCView  streamURL={remoteStream?.toURL()}  style={styles.videoView}
              />
          </View>
        }

        { (callInfo.callType !== 'video' || !remoteStream) &&
            <View style={styles.noVideo}>
                  <Image source={require('../../assets/logo.png')} /> 
                  {calling && <Text>Đang gọi ...</Text>}
            </View>
        }

        {/* my video */}
        {localStream && callInfo.callType === 'video' && videoEnabled &&
          <View style={styles.localVideoContainer}>
              <RTCView streamURL={(localStream?.toURL())} style={styles.videoView} />
          </View>
        }


        {/* header toobar */}
        <View style={styles.headerToolbar}>
          <Text style={{fontSize: 20}}> {callInfo.senderName}</Text>
          <View style={{flex:1}}></View>
          <TouchableOpacity  onPress={onSwitchCameras} style={[styles.button,{backgroundColor:'#eaeaea' }]}>
              <MaterialCommunityIcon name='restore' size={32} color={APP_THEME.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* bottom toolbar */}
        <View style={styles.bottomToolbar}>
            {callInfo.callType === 'video' &&
              <TouchableOpacity   style={[styles.button,{backgroundColor:'#eaeaea' }]} 
                onPress={onToogle('voice')}>
                { voiceEnabled?
                  <MaterialCommunityIcon name='microphone' size={32} color={APP_THEME.colors.primary} />
                  :  <MaterialCommunityIcon name='microphone-off' size={32} color={'red'} />
                }
              </TouchableOpacity>
            }

            <TouchableOpacity  onPress={stopCall} style={[styles.button,styles.hangupButton]}>
              <MaterialCommunityIcon name='phone-hangup' size={32} color={'#fff'} />
            </TouchableOpacity>

            {callInfo.callType === 'video' &&
            <TouchableOpacity   style={[styles.button,{backgroundColor:'#eaeaea' }]} 
              onPress={onToogle('video')}>
              { videoEnabled?
                <MaterialCommunityIcon name='video' size={32} color={APP_THEME.colors.primary} />
                :  <MaterialCommunityIcon name='video-off' size={32} color={'red'} />
              }
            </TouchableOpacity>
            }
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#efefef',
    flex: 1,
    padding: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  videoView: {
    height: '100%',
    width: '100%',
  },
  noVideo:{
    flex: 1,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  remoteVideoContainer: {
    height: '100%',
    width: '100%',
  },
  localVideoContainer: {
    height: 200,
    width: 120,
    position: 'absolute',
    right: 10,
    bottom: 90
  },
  headerToolbar:{
    position: 'absolute',
    width: '100%',
    height: 80,
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
    paddingLeft: 10,
    paddingRight:10,
  },
  bottomToolbar :{
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    color: 'white'
  },
  hangupButton:{
    backgroundColor: 'red',
    marginRight:10,
    marginLeft:10
  },
  button:{
    borderRadius: 30,
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

});
