import { HubConnection, HubConnectionBuilder, HubConnectionState, IHttpConnectionOptions } from "@microsoft/signalr";
import Pubsub from "../utils/pubSub";

class SignalRService {
    private baseUrl: string = '';

    private hubConnection: HubConnection | undefined;
    private pubSub : Pubsub = new Pubsub();
    public constructor(){
        this.baseUrl = process.env.REACT_APP_COM_API || '';
    }
    public subscription(evt: 'connected' | string , callback: (...args: any[])=>void){
      return this.pubSub.subscription(evt, callback);
    }

    private onConnected = () =>{
      this.pubSub.publish('connected');
    }

    async connect(path: string, withToken: boolean= false): Promise<void> {
        const url = this.baseUrl + path;
    
        const builder = new HubConnectionBuilder();
        if (!withToken) {
          builder.withUrl(url);
        } else {
          builder.withUrl(url, {
            accessTokenFactory: async () => {
              return sessionStorage.getItem('token');
            }
          } as IHttpConnectionOptions);
        }

        this.hubConnection = builder.withAutomaticReconnect().build();
    
        return this.hubConnection.start()
          .then(() => {
            if (this.isConnected()) {
              this.onConnected();
              console.log('SignalR: Connected to the server: ' + url);
            }
          })
          .catch(err => {
            console.error('SignalR: Failed to start with error: ' + err.toString());
          });
      }
    
      async define(methodName: string, newMethod: (...args: any[]) => void): Promise<void> {
        if (this.hubConnection) {
          this.hubConnection.on(methodName, newMethod);
        }
      }
    
      invoke(methodName: string, ...args: any[]): Promise<any> {
        if (this.isConnected()) {
          return this.hubConnection!.invoke(methodName, ...args);
        }
        return Promise.resolve()
      }
    
      disconnect(): void {
        if (this.isConnected()) {
          this.hubConnection?.stop();
        }
      }
    
      isConnected(): boolean {
        if(!this.hubConnection) 
            return false;
            
        return this.hubConnection.state === HubConnectionState.Connected;
      }
}

export const SignalR = new SignalRService();

export default SignalRService;