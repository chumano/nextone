import { HubConnection, HubConnectionBuilder, HubConnectionState, IHttpConnectionOptions } from "@microsoft/signalr";

class SignalRService {
    private baseUrl: string = '';

    private hubConnection: HubConnection | undefined;
    public SignalRService(){
        this.baseUrl = '';
    }

    async connect(path: string, withToken: boolean): Promise<void> {
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
    
      async invoke(methodName: string, ...args: any[]): Promise<any> {
        if (this.isConnected()) {
          return this.hubConnection?.invoke(methodName, ...args);
        }
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

export default SignalRService;