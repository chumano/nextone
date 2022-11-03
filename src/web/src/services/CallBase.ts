import Pubsub from "../utils/pubSub";
import { DeviceManager } from "./DeviceManager";
import { WebrtcUtils } from "./WebRTCUtils";
import { AppWindow } from "../config/AppWindow";
declare let window: AppWindow;
export const useWebrtcUtils = window.ENV.useWebrtcUtils || false;

export const CallSignalingActions = {
    SEND_CALL_REQUEST: 'call-send-request',
    SEND_CALL_REQUEST_RESPONSE: 'call-send-request-response',
    SEND_SESSION_DESCRIPTION: 'call-send-session-description',
    SEND_ICE_CANDIDATE: 'call-send-ice-cadidate',
    SEND_HANG_UP: 'call-send-hangup',
}

export const CallSignalingEvents = {
    CALL_MESSAGE: 'call-message',
    CALL_REQUEST: 'call-request'
}

export const CallEvents = {
    GOT_LOCAL_STREAM: 'local-stream',
    GOT_REOMOTE_STREAM: 'remote-stream',
    RECEIVE_CALL_REQUEST: 'receive-call-request',
    CONNECTION_DISCONECTED: 'connection-disconnected',
    CALL_STOPED: 'call-stopped'
}

export interface MediaConstraints {
    audio?: {
        enabled: boolean,
        deviceId?: string
    },
    video?: {
        enabled: boolean,
        deviceId?: string
    }
}

export interface ISignaling {
    isConnected(): boolean;

    invoke(action: string,
        ...args: any[]): Promise<any>;

    listen(eventName: string, handler: (...args: any[]) => void): () => void;
}

export interface CallMessage {
    type: 'call-request-response'
    | 'other-session-description'
    | 'other-ice-candidate'
    | 'other-hangup',
    data: any;
}

export abstract class CallBase {
    protected room: string = '';
    public getRoom = () => this.room;
    protected iceServers: RTCIceServer[] = window.ENV.IceServers || [];

    protected mediaConstraints?: MediaConstraints;
    protected localStream?: MediaStream = undefined;
    protected remoteStream?: MediaStream = undefined;
    protected peerConnection?: RTCPeerConnection;

    constructor(protected signaling: ISignaling,
        protected deviceManager: DeviceManager,
        protected pubSub: Pubsub) {

    }

    protected initConnection = async (mediaConstraints?: MediaConstraints) => {
        console.log("init connection...");
        this.mediaConstraints = mediaConstraints || {};
        const constraints: MediaStreamConstraints = {
            audio: false,
            video: false,
        }
        if (this.mediaConstraints) {
            const devices = await this.deviceManager.enumerateDevices();
            const audioInputs = devices.filter(o => o.type == 'audioinput');
            const videoInputs = devices.filter(o => o.type == 'videoinput');
            
            const audio = this.mediaConstraints.audio;
            const video = this.mediaConstraints.video;
            if (audio?.enabled && audioInputs.length >0) {
                if (audio.deviceId) {
                    constraints.audio = {
                        deviceId: audio.deviceId,
                        echoCancellation: true,
                        noiseSuppression: true
                    }as any
                } else {
                    constraints.audio = {
                        echoCancellation: true,
                        noiseSuppression: true
                    } as any;
                }
            }

            if (video?.enabled && videoInputs.length >0) {
                if (video.deviceId) {
                    constraints.video = {
                        deviceId: video.deviceId
                    }
                } else {
                    constraints.video = true;
                }
            }
        }

        const mediaStream = await this.deviceManager.getMediaStream(constraints);

        if (mediaStream) {
            console.log("get-stream", mediaStream);
            this.addLocalStream(mediaStream);

        } else {
            console.log("get-stream-error");
            this.localStream = undefined;
            //check user want to continue
        }

        try {
            this.createPeerConnection();

        } catch (e: any) {
            console.log('Failed to create PeerConnection.', e.message);
            return;
        }

        if (!this.peerConnection || !this.localStream) {
            console.log('Failed to create PeerConnection and LocalStream.');
            return;
        }

        const videoTracks = this.localStream!.getVideoTracks();
        if (videoTracks.length > 0) {
            this.peerConnection.addTrack(videoTracks[0], this.localStream);
        }

        const audioTracks = this.localStream!.getAudioTracks();
        if (audioTracks.length > 0) {
            this.peerConnection.addTrack(audioTracks[0], this.localStream);
        }

    }

    protected createPeerConnection = (): void => {
        console.log('Creating peer connection.');
        if (useWebrtcUtils) {
            this.peerConnection = WebrtcUtils.createPeerConnection(this.iceServers,
                'unified-plan', 'balanced', 'all', 'require',
                null, [], 0);
        } else {
            this.peerConnection = new RTCPeerConnection({
                iceServers: this.iceServers,
                sdpSemantics: 'unified-plan'
            } as RTCConfiguration);
        }

        if (!this.peerConnection) {
            return;
        }

        this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            console.log('peerConnection.onicecandidate', event);
            if (event.candidate) {
                this.sendIceCandidate(event);
            } else {
                console.log('End of candidates.');
            }
        };

        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
            console.log('peerConnection.ontrack', event);
            if (event.streams[0]) {
                this.addRemoteStream(event.streams[0]);
            }
        };

        this.peerConnection.onicecandidateerror = (event: Event) => {
            console.log('peerConnection.onicecandidateerror', event)
        }
        this.peerConnection.oniceconnectionstatechange = () => {
            console.log('peerConnection.oniceconnectionstatechange', this.peerConnection?.iceConnectionState)
            if (this.peerConnection?.iceConnectionState === 'connected') {
                if (useWebrtcUtils) {
                    WebrtcUtils.logStats(this.peerConnection, 'all');
                }

            } else if (this.peerConnection?.iceConnectionState === 'failed') {
                if (useWebrtcUtils) {
                    WebrtcUtils.doIceRestart(this.peerConnection, async (sdp) => {
                        this.peerConnection!.setLocalDescription(sdp);
                        await this.signaling.invoke(
                            CallSignalingActions.SEND_SESSION_DESCRIPTION,
                            {
                                room: this.room,
                                sdp
                            }
                        );
                    });
                }
            } else if (this.peerConnection?.iceConnectionState === 'disconnected') {
                //this.onEvent(CallEvents.CONNECTION_DISCONECTED)
            }
        }


    }

    protected addLocalStream = (stream: MediaStream) => {
        this.localStream = stream;
        this.onEvent(CallEvents.GOT_LOCAL_STREAM, stream);
    }

    protected addRemoteStream(stream: MediaStream): void {
        this.remoteStream = stream;
        this.onEvent(CallEvents.GOT_REOMOTE_STREAM, stream);
    }

    protected sendIceCandidate(event: RTCPeerConnectionIceEvent): void {
        console.log('Sending ice candidate to remote peer.');
        this.signaling.invoke(CallSignalingActions.SEND_ICE_CANDIDATE, {
            room: this.room,
            iceCandidate: {
                type: 'candidate',
                label: event?.candidate?.sdpMLineIndex,
                id: event?.candidate?.sdpMid,
                candidate: event?.candidate?.candidate
            }
        });
    }

    public addIceCandidate(data: { candidate: string, label: number,id:string }): void {
        console.log('Adding ice candidate.', data);
        if (!data.candidate) {
            console.log('data.candidate is null');
            return;
        }
        const candidate = new RTCIceCandidate({
            sdpMid: data.id,
            sdpMLineIndex: data.label,
            candidate: data.candidate
        });
        this.peerConnection!.addIceCandidate(candidate);
    }

    protected addTransceivers(): void {
        console.log('Adding transceivers.');
        const init = { direction: 'recvonly', streams: [], sendEncodings: [] } as RTCRtpTransceiverInit;
        this.peerConnection!.addTransceiver('audio', init);
        this.peerConnection!.addTransceiver('video', init);
    }

    protected onEvent(evt: string, ...args: any[]) {
        this.pubSub.publish(evt, ...args);
    }

    public hangup(isSender: boolean) {
        console.log(`hangup from ${isSender?'sender':'receiver'}`);

        //clear something
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = undefined;
        }

        if (this.localStream && this.localStream.active) {
            this.localStream.getTracks().forEach((track) => { track.stop(); });
        }
        if (this.remoteStream && this.remoteStream.active) {
            this.remoteStream.getTracks().forEach((track) => { track.stop(); });
        }

    }

    muteMic() {
        this.localStream!.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    }

    muteCam() {
        this.localStream!.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    }
}