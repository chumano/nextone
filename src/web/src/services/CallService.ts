import { WebrtcUtils } from "./WebRTCUtils";

interface ISignaling {
    connect(): Promise<void>;
    isConnected(): boolean;
    invoke(room: string, action: string,  ...args: any[]): void;
    listen(eventName: string, handler: (...args: any[]) => void): Promise<void>;
    disconnect():void;
}

const useWebrtcUtils = true;

class CallService {
    private localStream!: MediaStream;
    private remoteStream!: MediaStream;

    private room: string;
    private peerConnection!: RTCPeerConnection;

    private isInitiator: boolean = false;
    private isChannelReady: boolean = false;
    private isStarted: boolean = false;

    private iceServers: RTCIceServer[] = [
        { urls: 'stun:stun.1.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ];

    constructor(
        private signaling: ISignaling,
        room: string
    ) {
        this.room = room;
    }

     start = async () => {
        // #1 connect to signaling server
        await this.signaling.connect();
        if (this.signaling.isConnected()) {
            this.signaling.invoke('CreateOrJoinRoom', this.room);
        }

        // #2 define signaling communication
        this.defineSignaling();

        // #3 get media from current client
        this.getUserMedia();
    }

    defineSignaling(): void {
        this.signaling.listen('log', (message: any) => {
            console.log(message);
        });

        this.signaling.listen('created', () => {
            this.isInitiator = true;
        });

        this.signaling.listen('joined', () => {
            this.isChannelReady = true;
        });

        this.signaling.listen('message', (message: any) => {
            if (message === 'got user media') {
                this.initiateCall();

            } else if (message.type === 'offer') {
                if (!this.isStarted) {
                    this.initiateCall();
                }
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
                this.sendAnswer();

            } else if (message.type === 'answer' && this.isStarted) {
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));

            } else if (message.type === 'candidate' && this.isStarted) {
                this.addIceCandidate(message);

            } else if (message === 'bye' && this.isStarted) {
                this.handleRemoteHangup();
            }
        });
    }

    muteMic() {
        this.localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      }
      
    muteCam() {
    this.localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    }

    getUserMedia(): void {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
            .then((stream: MediaStream) => {
                this.addLocalStream(stream);
                this.sendMessage('got user media');
                if (this.isInitiator) {
                    this.initiateCall();
                }
            })
            .catch((e) => {
                alert('getUserMedia() error: ' + e.name + ': ' + e.message);
            });
    }

    initiateCall(): void {
        console.log('Initiating a call.');
        if (!this.isStarted && this.localStream && this.isChannelReady) {
            this.createPeerConnection();

            this.peerConnection.addTrack(this.localStream.getVideoTracks()[0], this.localStream);
            this.peerConnection.addTrack(this.localStream.getAudioTracks()[0], this.localStream);

            this.isStarted = true;
            if (this.isInitiator) {
                this.sendOffer();
            }
        }
    }

    createPeerConnection(): void {
        console.log('Creating peer connection.');
        try {
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

            if(!this.peerConnection){
                return;
            }

            this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
                if (event.candidate) {
                    this.sendIceCandidate(event);
                } else {
                    console.log('End of candidates.');
                }
            };

            this.peerConnection.ontrack = (event: RTCTrackEvent) => {
                if (event.streams[0]) {
                    this.addRemoteStream(event.streams[0]);
                }
            };

            if (useWebrtcUtils) {
                this.peerConnection.oniceconnectionstatechange = () => {
                    if (this.peerConnection?.iceConnectionState === 'connected') {
                        WebrtcUtils.logStats(this.peerConnection, 'all');
                    } else if (this.peerConnection?.iceConnectionState === 'failed') {
                        WebrtcUtils.doIceRestart(this.peerConnection, this);
                    }
                }
            }
        } catch (e :any) {
            console.log('Failed to create PeerConnection.', e.message);
            return;
        }
    }

    sendOffer(): void {
        console.log('Sending offer to peer.');
        this.addTransceivers();
        
        this.peerConnection.createOffer()
            .then((sdp: RTCSessionDescriptionInit) => {
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
                this.peerConnection.setLocalDescription(finalSdp);
                this.sendMessage(sdp);
            });
    }

    async sendAnswer() {
        console.log('Sending answer to peer.');
        this.addTransceivers();
        const sdp = await this.peerConnection.createAnswer();
        this.peerConnection.setLocalDescription(sdp);
        this.sendMessage(sdp);
    }

    addIceCandidate(message: any): void {
        console.log('Adding ice candidate.');
        const candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        this.peerConnection.addIceCandidate(candidate);
    }

    sendIceCandidate(event: RTCPeerConnectionIceEvent): void {
        console.log('Sending ice candidate to remote peer.');
        this.sendMessage({
            type: 'candidate',
            label: event?.candidate?.sdpMLineIndex,
            id: event?.candidate?.sdpMid,
            candidate: event?.candidate?.candidate
        });
    }

    sendMessage(message:any): void {
        this.signaling.invoke('SendMessage', message, this.room);
    }

    addTransceivers(): void {
        console.log('Adding transceivers.');
        const init = { direction: 'recvonly', streams: [], sendEncodings: [] } as RTCRtpTransceiverInit;
        this.peerConnection.addTransceiver('audio', init);
        this.peerConnection.addTransceiver('video', init);
    }

    addLocalStream(stream: MediaStream): void {
        console.log('Local stream added.');
        this.localStream = stream;

        //this.localVideo.nativeElement.srcObject = this.localStream;
        //this.localVideo.nativeElement.muted = 'muted';
    }

    addRemoteStream(stream: MediaStream): void {
        console.log('Remote stream added.');
        this.remoteStream = stream;

        //this.remoteVideo.nativeElement.srcObject = this.remoteStream;
        //this.remoteVideo.nativeElement.muted = 'muted';
    }

    hangup(): void {
        console.log('Hanging up.');
        this.stopPeerConnection();
        this.sendMessage('bye');
        this.signaling.invoke('LeaveRoom', this.room);
        setTimeout(() => {
            this.signaling.disconnect();
        }, 1000);
    }

    handleRemoteHangup(): void {
        console.log('Session terminated by remote peer.');
        this.stopPeerConnection();
        this.isInitiator = true;
       
        //this.snack.open('Remote client has left the call.', 'Dismiss', { duration: 5000 });
    }

    stopPeerConnection(): void {
        this.isStarted = false;
        this.isChannelReady = false;
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null as any;
        }
    }

    destroy(): void {
        this.hangup();
        if (this.localStream && this.localStream.active) {
            this.localStream.getTracks().forEach((track) => { track.stop(); });
        }
        if (this.remoteStream && this.remoteStream.active) {
            this.remoteStream.getTracks().forEach((track) => { track.stop(); });
        }
    }
}

export default CallService;