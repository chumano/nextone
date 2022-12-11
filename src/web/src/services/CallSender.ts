import Pubsub from "../utils/pubSub";
import { CallBase, CallMessage, CallSignalingActions, CallSignalingEvents, ISignaling, MediaConstraints, useWebrtcUtils } from "./CallBase";
import { DeviceManager } from "./DeviceManager";
import { WebrtcUtils } from "./WebRTCUtils";

export class CallSender extends CallBase {
    constructor(signaling: ISignaling,
        deviceManager: DeviceManager,
        pubSub: Pubsub,
        private user: string) {
            super(signaling, deviceManager,pubSub);
    }

    public startCallRequest = async (room: string, callType: 'voice' | 'video',mediaConstraints?: MediaConstraints) => {
        //console.log('startCallRequest')
        this.room = room;   

        await this.initConnection(mediaConstraints);
        //console.log('signaling.invoke SEND_CALL_REQUEST' )
        const response  = await this.signaling.invoke(CallSignalingActions.SEND_CALL_REQUEST, 
            {
                room,
                callType
            });

        return {
                error: response
            }
    }

    public receiveAnswer = (sdp: RTCSessionDescriptionInit )=>{
        this.peerConnection!.setRemoteDescription(new RTCSessionDescription(sdp));
    }


    public sendOffer = async () => {
        //console.log('Sending offer to peer.');
        this.addTransceivers();

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
        await this.signaling.invoke(CallSignalingActions.SEND_SESSION_DESCRIPTION,
            {
                room: this.room,
                sdp :finalSdp
            }
        );
    }

}