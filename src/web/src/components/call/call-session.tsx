import '../../styles/components/call/call-session.scss';
import { ReactComponent as VoiceView } from '../../assets/images/call/voice_view.svg';
import { ReactComponent as CallOptionsIcon } from '../../assets/images/call/options.svg';
import { ReactComponent as AddUserIcon } from '../../assets/images/call/add_user.svg';

import { ReactComponent as MessageTextIcon } from '../../assets/images/call/message_text.svg';
import { ReactComponent as CallSettingsIcon } from '../../assets/images/call/settings.svg';

import { ReactComponent as CallIcon } from '../../assets/images/call/call.svg';
import { ReactComponent as VoiceOnIcon } from '../../assets/images/call/voice1.svg';
import { ReactComponent as VoiceOffIcon } from '../../assets/images/call/voice1_off.svg';
import { ReactComponent as VideoOnIcon } from '../../assets/images/call/video.svg';
import { ReactComponent as VideoOffIcon } from '../../assets/images/call/video_off.svg';

import bgImageUrl from '../../assets/images/call/bg_sample.png'

import ButtonAction from './button-action';
import CallService from '../../services/CallService';
import { useEffect, useState } from 'react';
import { CallEvents } from '../../services/CallBase';
import Video, { StreamWithURL } from './video';
import { useDispatch, useSelector } from 'react-redux';
import { callActions, getCallState, IAppStore } from '../../store';
import { ConversationState } from '../../store/chat/ChatState';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { UserStatus } from '../../models/user/UserStatus.model';


const CallSession: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((store: IAppStore) => store.auth.user);
    const userId = user!.profile.sub;
    const { status: callStatus, isSender,
        callType,
        converstationId, deviceSettings } = useSelector(getCallState)
    const {
        allConversations,
    } = useSelector((store: IAppStore) => store.chat);

    const [conversationName, setConversationName] = useState<string>();
    const [otherUser, setOtherUser] = useState<UserStatus>();

    const [voiceEnabled, setVoiceEnabled] = useState(!!deviceSettings?.audioInputId);
    const [videoEnabled, setVideoEnabled] = useState(!!deviceSettings?.videoInputId);

    const [localStream, setLocalStream] = useState<StreamWithURL>();
    const [remoteStream, setRemoteStream] = useState<StreamWithURL>();
    const [conversation, setConversation] = useState<ConversationState>();

    useEffect(() => {
        const conversation = allConversations.find(o => o.id == converstationId);
        setConversation(conversation);
    }, [converstationId, allConversations])


    useEffect(() => {
        if(!conversation) return;
        if (conversation.type === ConversationType.Peer2Peer) {
            const otherUsers = conversation.members.filter(o => o.userMember.userId != userId)
            setOtherUser(otherUsers[0].userMember);
            setConversationName(otherUsers[0].userMember.userName)
        } else {
            setConversationName(conversation.name);
        }
    }, [conversation])

    useEffect(()=>{
        setLocalStream((localStream)=>{
            if(localStream?.stream){
                if( localStream.stream.getAudioTracks().length >0){
                    localStream.stream.getAudioTracks()[0].enabled = voiceEnabled;
                }
                if( localStream.stream.getVideoTracks().length >0){
                    localStream.stream.getVideoTracks()[0].enabled = videoEnabled;
                }
            }
           
            return localStream;
        });
    },[voiceEnabled, videoEnabled])

    useEffect(()=>{
        //TODO: replace stream
    },[deviceSettings])

    //lisen on call
    useEffect(() => {
        const subscriptions: any[] = [];
        const subscription1 = CallService.listen(CallEvents.GOT_LOCAL_STREAM, (mediaStream: MediaStream) => {
            console.log('CallSession GOT_LOCAL_STREAM', mediaStream);
            setLocalStream({
                stream: mediaStream,
                streamId: 'abc'
            });
        });
        subscriptions.push(subscription1);

        const subscription2 = CallService.listen(CallEvents.GOT_REOMOTE_STREAM, (mediaStream: MediaStream) => {
            console.log('CallSession GOT_REOMOTE_STREAM', mediaStream);
            setRemoteStream({
                stream: mediaStream,
                streamId: 'xyz'
            });
        });
        subscriptions.push(subscription2);

        const subscription3 = CallService.listen(CallEvents.CONNECTION_DISCONECTED, (mediaStream: MediaStream) => {
            CallService.stopCall();
        });
        subscriptions.push(subscription3);

        const subscription4 = CallService.listen(CallEvents.CALL_STOPED, (mediaStream: MediaStream) => {
            dispatch(callActions.stopCall())
        });
        subscriptions.push(subscription4);

        //subscribe
        subscriptions.forEach(subscription => {
            subscription.subscribe();
        });

        if (isSender && converstationId) {
            CallService.startCall(converstationId, callType, {
                audio : !!deviceSettings?.audioInputId ? {
                        enabled : true,
                        deviceId : deviceSettings?.audioInputId
                    }: {
                        enabled: false
                    },
                video : !!deviceSettings?.videoInputId && callType =='video' ? {
                    enabled : true,
                    deviceId : deviceSettings?.videoInputId
                }: {
                    enabled: false
                }
            }).then(() => {
                console.log('CallSession call started',);
            }).catch(err => {
                console.error(' CallService.startCall error', err)
            });
        }
        else {
            //receive call 
        }

        return () => {
            subscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
            onStopCall();
        }
    }, [isSender, callStatus, converstationId, deviceSettings, callType])

    const onToggle = (type: 'voice' | 'video') => {
        return ()=>{
            if(type=='voice'){
                setVoiceEnabled(s => !s)
            }else{
                setVideoEnabled(s => !s)
            }
            
        }
    }

    const onStopCall = () => {
        CallService.stopCall().then(() => {
            console.log('CallSession call stopped',);
        }).catch(err => {
            console.error(' CallService.stopCall error', err)
        })
    }

    return <>
        <div className="call-session">
            <div className='call-session__video-container'>
                {!remoteStream && <img src={bgImageUrl} />}
                <Video stream={remoteStream} />
            </div>
            {!remoteStream &&
                <div className='call-session__voice-container'>
                    <div className='user-view'>
                        <VoiceView />
                    </div>
                </div>
            }


            <div className='call-session__overlay'>
                <div className='top-bar'>
                    <div className='call-title'>
                        {conversationName}
                    </div>
                    <div className='flex-spacer'></div>
                    {/* <div className='group-buttons'>
                        <ButtonAction className="on">
                            <AddUserIcon />
                        </ButtonAction>
                        <ButtonAction className="on">
                            <CallOptionsIcon />
                        </ButtonAction>
                    </div> */}

                </div>


                <div className='bottom-bar'>
                    <div className='group-buttons'>
                        <ButtonAction >
                            <MessageTextIcon />
                        </ButtonAction>
                    </div>
                    <div className='flex-spacer'></div>
                    <div className='group-buttons call-buttons'>
                        <ButtonAction className={voiceEnabled?'on': 'off'}  onClick={onToggle('voice')}>
                            {!voiceEnabled && <VoiceOnIcon />}
                            {voiceEnabled && <VoiceOffIcon />}
                        </ButtonAction>
                        <ButtonAction className={'stop-call'} onClick={onStopCall}>
                            <CallIcon />
                        </ButtonAction>
                        <ButtonAction className={videoEnabled?'on': 'off'}   onClick={onToggle('video')}>
                            {!videoEnabled && <VideoOnIcon />}
                            {videoEnabled && <VideoOffIcon />}
                        </ButtonAction>
                    </div>
                    <div className='flex-spacer'></div>
                    <div className='group-buttons'>
                        <ButtonAction  onClick={()=>{
                             dispatch(callActions.showModal({ modal: 'device', visible: true }));
                        }}>
                            <CallSettingsIcon />
                        </ButtonAction>
                    </div>
                </div>

                <div className='local-video-container'>
                    <Video stream={localStream} />
                </div>
            </div>
        </div>

    </>
}

export default CallSession;