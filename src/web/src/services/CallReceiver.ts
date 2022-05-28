import Pubsub from "../utils/pubSub";
import { CallBase, CallMessage, CallSignalingActions, 
     ISignaling } from "./CallBase";
import { DeviceManager } from "./DeviceManager";

export class CallReciver extends CallBase {
    state: string = '';

    constructor(signaling: ISignaling,
        deviceManager: DeviceManager,
        pubSub: Pubsub,
        private user: string) {
            super(signaling, deviceManager,pubSub);
    }

    public async acceptCall(room: string){
        console.log("accept call...")
        this.room = room;
        await this.initConnection();

        await this.signaling.invoke(
            CallSignalingActions.SEND_CALL_REQUEST_RESPONSE,
            {
                room,
                accepted: true
            }
        );
    
        //setTimeout to await offer
        //hangup if no response
    }

    public receiveOffer = (sdp: RTCSessionDescriptionInit )=>{
        this.peerConnection!.setRemoteDescription(new RTCSessionDescription(sdp));
        this.sendAnswer();
    }

    private sendAnswer = async () => {
        console.log('Sending answer to peer.');
        this.addTransceivers();

        const sdp = await this.peerConnection!.createAnswer();
        this.peerConnection!.setLocalDescription(sdp);
        await this.signaling.invoke(
            CallSignalingActions.SEND_SESSION_DESCRIPTION,
            {
                room: this.room,
                sdp
            }
        );
    }

}