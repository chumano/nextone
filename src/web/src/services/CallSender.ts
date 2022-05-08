import Pubsub from "../utils/pubSub";
import { CallBase, CallMessage, CallSignalingActions, CallSignalingEvents, ISignaling, useWebrtcUtils } from "./CallBase";
import { DeviceManager } from "./DeviceManager";
import { WebrtcUtils } from "./WebRTCUtils";

export class CallSender extends CallBase {

    state: string = '';
    constructor(signaling: ISignaling,
        deviceManager: DeviceManager,
        pubSub: Pubsub,
        private user: string) {
            super(signaling, deviceManager,pubSub);
    }

    public startCallRequest = async (receiver: string) => {
        console.log('startCallRequest')
        this.state = 'call-requesting';
        this.onEvent(this.state);       

        await this.initConnection();
        console.log('signaling.invoke SEND_CALL_REQUEST' )
        await this.signaling.invoke(
            CallSignalingActions.SEND_CALL_REQUEST, 
            receiver);
        this.state = 'call-requested';
        this.onEvent(this.state);
     
        
        //setTimeout to await acception
        //hangup if no response
    }

    public receiveAnswer = (sdp: RTCSessionDescriptionInit )=>{
        this.peerConnection!.setRemoteDescription(new RTCSessionDescription(sdp));
    }


    public sendOffer = async () => {
        console.log('Sending offer to peer.');
        //this.addTransceivers();

        const sdp : RTCSessionDescriptionInit =  await this.peerConnection!.createOffer()
        let finalSdp = sdp;
        if (useWebrtcUtils) {
            finalSdp = WebrtcUtils.changeBitrate(sdp, '1000', '500', '6000');
            if (WebrtcUtils.getCodecs('audio').find(c => c.indexOf(WebrtcUtils.OPUS) !== -1)) {
                finalSdp = WebrtcUtils.setCodecs(finalSdp, 'audio', WebrtcUtils.OPUS);
            }
            if (WebrtcUtils.getCodecs('video').find(c => c.indexOf(WebrtcUtils.H264) !== -1)) {
                finalSdp = WebrtcUtils.setCodecs(finalSdp, 'video', WebrtcUtils.H264);
            }
        }
        this.peerConnection!.setLocalDescription(finalSdp);
        await this.signaling.invoke(
            CallSignalingActions.SEND_SESSION_DESCRIPTION,
            sdp);
    }

}