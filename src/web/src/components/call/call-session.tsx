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
import { callActions, getCallState } from '../../store';


const CallSession: React.FC = () => {
    const dispatch = useDispatch();
    const {status : callStatus, isSender} = useSelector(getCallState)
    
    const [localStream, setLocalStream] = useState<StreamWithURL>();
    const [remoteStream, setRemoteStream] = useState<StreamWithURL>();
    useEffect(()=>{
        const subscriptions : any[]= [];
        const subscription1 = CallService.listen(CallEvents.GOT_LOCAL_STREAM, (mediaStream:MediaStream)=>{
            console.log('CallSession GOT_LOCAL_STREAM', mediaStream);
            setLocalStream({
                stream: mediaStream,
                streamId : 'abc'
            });
        });
        subscriptions.push(subscription1);

        const subscription2 = CallService.listen(CallEvents.GOT_REOMOTE_STREAM, (mediaStream:MediaStream)=>{
            console.log('CallSession GOT_REOMOTE_STREAM', mediaStream);
            setRemoteStream({
                stream: mediaStream,
                streamId : 'xyz'
            });
        });
        subscriptions.push(subscription2);

        const subscription3= CallService.listen(CallEvents.CONNECTION_DISCONECTED, (mediaStream:MediaStream)=>{
            CallService.stopCall();
        });
        subscriptions.push(subscription3);

        const subscription4= CallService.listen(CallEvents.CALL_STOPED, (mediaStream:MediaStream)=>{
            dispatch(callActions.stopCall())
        });
        subscriptions.push(subscription4);

        //subscribe
        subscriptions.forEach(subscription=>{
            subscription.subscribe();
        });
       
        if(isSender){
            CallService.startCall().then(()=>{
                console.log('CallSession call started',);
            }).catch(err=>{
                console.error(' CallService.startCall error', err)
            });
        }
        else{
            //receive call 
        }

        return ()=>{
            subscriptions.forEach(subscription=>{
                subscription.unsubscribe();
            });
            CallService.stopCall().then(()=>{
                console.log('CallSession call stopped',);
            }).catch(err=>{
                console.error(' CallService.stopCall error', err)
            })
    
        }
    },[isSender])
    
    return <>
        <div className="call-session">
            <div className='call-session__video-container'>
                {!localStream && <img src={bgImageUrl}/>}
                <Video stream={localStream}/>
            </div>
            {!localStream&&
                <div className='call-session__voice-container'>
                    <div className='user-view'>
                        <VoiceView />
                    </div>
                </div>
            }

            
            <div className='call-session__overlay'>
                <div className='top-bar'>
                    <div className='call-title'>
                        {'Hoàng Xuân Lộc'}
                    </div>
                     <div className='flex-spacer'></div>
                     <div className='group-buttons'>
                        <ButtonAction className="on">
                            <AddUserIcon />
                        </ButtonAction>
                        <ButtonAction className="on">
                            <CallOptionsIcon />
                        </ButtonAction>
                     </div>
                    
                </div>

                
                <div className='bottom-bar'>
                    <div className='group-buttons'>
                        <ButtonAction className="on">
                            <MessageTextIcon />
                        </ButtonAction>
                    </div>
                    <div className='flex-spacer'></div>
                    <div className='group-buttons call-buttons'>
                        <ButtonAction className="on">
                            <VoiceOnIcon />
                        </ButtonAction>
                        <ButtonAction className="off">
                            <CallIcon />
                        </ButtonAction>
                        <ButtonAction className="on">
                            <VideoOnIcon />
                        </ButtonAction>
                    </div>
                    <div className='flex-spacer'></div>
                    <div className='group-buttons'>
                        <ButtonAction className="on">
                            <CallSettingsIcon />
                        </ButtonAction>
                    </div>
                </div>

                <div className='local-video-container'>
                    <Video stream={remoteStream}/>
                </div>
            </div>
        </div>

    </>
}

export default CallSession;