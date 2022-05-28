import Pubsub from "../utils/pubSub";
import { CallEvents, CallMessage, CallSignalingActions, CallSignalingEvents, ISignaling, useWebrtcUtils } from "./CallBase";
import { CallReciver as CallReceiver } from "./CallReceiver";
import { CallSender } from "./CallSender";
import { DeviceManager } from "./DeviceManager";
import { SignalR } from "./SignalRService";

class CallService {
    private signaling: ISignaling;
    private deviceManager: DeviceManager;
    private callSender: CallSender;
    private callReceiver: CallReceiver;

    private isSender: boolean = false;
    private callUnsubcrideFunc? : ()=>void;
    private pubSub: Pubsub = new Pubsub();

    constructor() {
        this.signaling = new SignalRSignaling();
        this.deviceManager = new DeviceManager();
        this.callSender = new CallSender(this.signaling,  this.deviceManager, this.pubSub,'');
        this.callReceiver = new CallReceiver(this.signaling, this.deviceManager, this.pubSub,'');
    }

    
    public init = async () => {
        this.signaling.listen(CallSignalingEvents.CALL_REQUEST, (room) => {
            //TODO: receive call-request , wait user accept
            console.log("receiving a call...")
            this.isSender = false;
            this.pubSub.publish(CallEvents.RECEIVE_CALL_REQUEST, room);
        });

    }

    private callMessageHandler =  (message: CallMessage) => {
        console.log("receive-"+ message.type, message.data)
        switch (message.type) {
            //sender
            case 'call-request-response':
                const { accepted } = message.data;
                if (!accepted) {
                    this.callSender.hangup();
                    this.pubSub.publish(CallEvents.CALL_STOPED);
                    return;
                }
                this.callSender.sendOffer();

                break;
           

            //sender + receiver
            case 'other-session-description':
                {
                    const sdp: RTCSessionDescriptionInit = message.data;
                    if (sdp.type === 'answer' && this.isSender) {
                        this.callSender.receiveAnswer(sdp);
                    }else if (sdp.type === 'offer' && !this.isSender) {
                        this.callReceiver.receiveOffer(sdp);
                    }
                    break;
                }

            case 'other-ice-candidate':
                {
                    const candidateResponse = message.data;
                    const { label, id, candidate } = message.data;
                    if (this.isSender) {
                        this.callSender.addIceCandidate(candidateResponse);
                    } else {
                        this.callReceiver.addIceCandidate(candidateResponse);
                    }

                    break;
                }
            case 'other-hangup':
                {
                    console.log('other-hangup');
                    this.stopCall();
                    break;
                }
        }
    }

    private listenCallMessage = ()=>{
        this.callUnsubcrideFunc = this.signaling.listen(CallSignalingEvents.CALL_MESSAGE,this.callMessageHandler.bind(this));
    }

    public acceptCallRequest = async(room:string)=>{
        this.listenCallMessage();
        this.callReceiver.acceptCall(room);
    }

    public ignoreCallRequest = async(room:string)=>{
        console.log("ignore call...")
        this.signaling.invoke(CallSignalingActions.SEND_CALL_REQUEST_RESPONSE,
            {
                room,
                accepted: false
            })
    }

    public startCall = async (room: string) => {
        const devices = await this.deviceManager.enumerateDevices(); 
        console.log('devices', devices)

        this.listenCallMessage();
        this.isSender = true;
        await this.callSender.startCallRequest(room);
    }

    public stopCall = async (notifiyOther: boolean = true) => {
        let room = '';
        if (this.isSender) {
            room = this.callSender.getRoom();
            this.callSender.hangup();
        } else {
            room = this.callReceiver.getRoom();
            this.callReceiver.hangup();
        }
        //remove signaling listen
        this.callUnsubcrideFunc?.();
        this.callUnsubcrideFunc = undefined;

        this.pubSub.publish(CallEvents.CALL_STOPED);
        if(notifiyOther){
            this.signaling.invoke(CallSignalingActions.SEND_HANG_UP,room);
        }
    }

    public listen = (evt: string, callback :(...args : any[])=> void) =>{
        return this.pubSub.subscription(evt, callback);
    }
}

class SignalRSignaling implements ISignaling {
    constructor() {

    }

    isConnected(): boolean {
        return SignalR.isConnected();
    }
    invoke(action: string, data: any): Promise<any> {
        return SignalR.invoke(
            'sendCallMessage', 
            action,
            data
        )
    }
    listen(eventName: string, handler: (...args: any[]) => void) {
        const subscription = SignalR.subscription(eventName, handler);
        subscription.subscribe();
        return subscription.unsubscribe;
    }

}
 const CallServiceInstance = new CallService();

 export default CallServiceInstance;