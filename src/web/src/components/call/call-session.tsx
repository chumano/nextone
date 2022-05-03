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


const CallSession: React.FC = () => {
    return <>
        <div className="call-session">
            <div className='call-session__video-container'>
                <img src={bgImageUrl}/>
            </div>
            <div className='call-session__voice-container'>
                <div className='user-view'>
                    <VoiceView />
                </div>
            </div>

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
            </div>
        </div>

    </>
}

export default CallSession;