
import * as signalR from '@microsoft/signalr';
import { APP_CONFIG } from '../constants/app.config';
import qs from 'qs';
import { UserTokenInfoResponse } from '../types/Auth/Auth.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types/Message/Message.type';

export class SignalRService {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(APP_CONFIG.COM_HOST + "/hubChat")
      .withAutomaticReconnect()
      .build();

    events : { [key: string]:  ((...args: any[]) => void) []} = {};
    constructor() {
      this.init();
    }
    private init() {
      this.connection.onreconnected((connectionid) => {
        //console.log(`[Hub] onreconnected: ${connectionid}`)
        try{
          this.onConnected();
        }catch(err){
          console.error('onConnected Error', err)
        }
       
      })

      this.connection.onclose((error) => {
        //console.log(`[Hub] onClose:`, error)
      })
      this.connection.onreconnecting((error) => {
        //console.log(`[Hub] onreconnecting:`, error)
      })
  
      this.connection.on("data", (message: { eventKey: string, eventData: any }) => {
        ////console.log("[Hub] receive data", message)
        this.onEvent(message.eventKey, message.eventData);
      });
    }
  
    connectHub = async () => {
      //console.log("[Hub] connectHub ", this.connection?.state)
      try{
        if(this.connection.state === signalR.HubConnectionState.Connecting 
         || this.connection.state === signalR.HubConnectionState.Connected
          || this.connection.state === signalR.HubConnectionState.Reconnecting){
            //console.log(`[Hub] connectHub isConnected/Connecting`)
            return;
        }else{
          // try{
          //   await this.connection.stop();
          // }catch{}
  
          await this.connection.start();
        }
       
    
        this.onConnected();
        
      }catch(err){
        console.error('connectHub', err)
      }
      
    }
  
    disconnectHub = async () => {
      if (this.connection) {
        //console.log("disconnectHub", this.connection.state)
        await this.connection.stop();
      }
    }

    invoke(action: string, data: any): Promise<any> {
      return this.connection!.invoke('sendCallMessage', action, data);
    }
  
    subscription  = (eventName:string , func : (data:any)=>void )=>{
      if (this.events[eventName]) {
          this.events[eventName].push(func);
      } else {
          this.events[eventName] = [func];
      }
      return  {
        unsubscribe: ()=>{
          if (!this.events[eventName]) return;
          this.events[eventName] = this.events[eventName].filter((subscriber) => subscriber !== func);
        }
      }
    }
  
    private onEvent(eventName: string, ...args: any[]) {
      const funcs = this.events[eventName];
      if (Array.isArray(funcs)) {
          funcs.forEach((func) => {
              func.apply(null, args);
          });
      }
   }
  
    isDisconnected() :boolean{
      if (!this.connection)
        return true;
      return  this.connection.state == signalR.HubConnectionState.Disconnected;
    }

    isConnected(): boolean {
      if (!this.connection)
        return false;
  
      return this.connection.state === signalR.HubConnectionState.Connected;
    }

    private async onConnected(){
      const userTokenInfoString = await AsyncStorage.getItem('@UserToken');
      if (userTokenInfoString) {
        const userTokenInfoResponse = qs.parse(
          userTokenInfoString,
        ) as unknown as UserTokenInfoResponse;
        const accessToken = userTokenInfoResponse.access_token;
        const hubRegisterResult = await this.connection.invoke('register',accessToken);
        //console.log('[Hub] registerResult', hubRegisterResult)
      }
      this.onEvent('connected', true);
    }
  }

  
const signalRService = new SignalRService();

export default signalRService;