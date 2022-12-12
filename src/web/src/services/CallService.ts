import Pubsub from "../utils/pubSub";
import { CallEvents, CallMessage, CallSignalingActions, CallSignalingEvents, ISignaling, MediaConstraints, useWebrtcUtils } from "./CallBase";
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

    public isReceiveResponse : boolean = false;

    constructor() {
        this.signaling = new SignalRSignaling();
        this.deviceManager = new DeviceManager();
        this.callSender = new CallSender(this.signaling,  this.deviceManager, this.pubSub,'');
        this.callReceiver = new CallReceiver(this.signaling, this.deviceManager, this.pubSub,'');
    }

    
    public init = async () => {
        this.signaling.listen(CallSignalingEvents.CALL_REQUEST, (room) => {
            //console.log("receiving a call...")
            this.isSender = false;
            this.pubSub.publish(CallEvents.RECEIVE_CALL_REQUEST, room);
        });

    }

    private callMessageHandler = async (message: CallMessage) => {
        //console.log("[callMessageHandler] receive-"+ message.type, message.data)
        try{
            switch (message.type) {
                //sender
                case 'call-request-response':
                    const { accepted } = message.data;
                    this.isReceiveResponse = true;
                    if (!accepted) {
                        this.callSender.hangup(this.isSender);
                        this.pubSub.publish(CallEvents.CALL_STOPED);
                        return;
                    }
                    await this.callSender.sendOffer();
    
                    break;
               
                //sender + receiver
                case 'other-session-description':
                    {
                        const sdp: RTCSessionDescriptionInit = message.data;
                        if (sdp.type === 'answer' && this.isSender) {
                            this.callSender.receiveAnswer(sdp);
                        }else if (sdp.type === 'offer' && !this.isSender) {
                            await this.callReceiver.receiveOffer(sdp);
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
                        //console.log('other-hangup => CallService.stopCall');
                        await this.stopCall();
                        break;
                    }
            }
        }catch(err){
            console.error('callMessageHandler' , message , err)
        }
        
    }

    private listenCallMessage = ()=>{
        this.callUnsubcrideFunc = this.signaling.listen(CallSignalingEvents.CALL_MESSAGE,this.callMessageHandler.bind(this));
    }

    public startCall = async (room: string,callType: 'voice' | 'video' ,mediaConstraints?: MediaConstraints) => {
        this.listenCallMessage();
        this.isSender = true;
        return await this.callSender.startCallRequest(room,callType, mediaConstraints);
    }

    public acceptCallRequest = async(room:string, mediaConstraints?: MediaConstraints)=>{
        this.listenCallMessage();
        return this.callReceiver.acceptCall(room, mediaConstraints);
    }

    public ignoreCallRequest = async(room:string)=>{
        //console.log("ignore call...")
        this.signaling.invoke(CallSignalingActions.SEND_CALL_REQUEST_RESPONSE,
            {
                room,
                accepted: false
            })
    }

    public stopCall = async (notifiyOther: boolean = true) => {
        let room = '';
        if (this.isSender) {
            room = this.callSender.getRoom();
            this.callSender.hangup(this.isSender);
        } else {
            room = this.callReceiver.getRoom();
            this.callReceiver.hangup(this.isSender);
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
        return SignalR.invoke('sendCallMessage', 
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