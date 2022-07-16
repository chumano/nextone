
import * as signalR from '@microsoft/signalr';
import { APP_CONFIG } from '../constants/app.config';
import qs from 'qs';
import { UserTokenInfoResponse } from '../types/Auth/Auth.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types/Message/Message.type';

export class SignalRService {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(APP_CONFIG.COM_HOST + "/hubChat")
      .build();
    events : { [key: string]:  ((...args: any[]) => void) []} = {};
    constructor() {
      this.init();
    }
    private init() {
      this.connection.onreconnected((connectionid) => {
        console.log(`[Hub] onreconnected: ${connectionid}`)
      })
      this.connection.onreconnected((connectionid) => {
        console.log(`[Hub] onreconnected: ${connectionid}`)
      })
      this.connection.onclose((error) => {
        console.log(`[Hub] onClose:`, error)
      })
  
      this.connection.on("data", (message: { eventKey: string, eventData: any }) => {
        console.log("[Hub] receive data", message)
        this.onEvent(message.eventKey, message.eventData);
      });
    }
  
    connectHub = async () => {
      if (this.isConnected()) {
        console.log(`[Hub] connectHub isConnected`)
        return;
      }
      await this.connection.start();
  
      const userTokenInfoString = await AsyncStorage.getItem('@UserToken');
      if (userTokenInfoString) {
        const userTokenInfoResponse = qs.parse(
          userTokenInfoString,
        ) as unknown as UserTokenInfoResponse;
        const accessToken = userTokenInfoResponse.access_token;
        const hubRegisterResult = await this.connection.invoke('register',accessToken);
        console.log('[Hub] registerResult', hubRegisterResult)
      }
    }
  
    disconnectHub = async () => {
      if (this.connection) {
        this.connection.stop();
      }
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
  
    isConnected(): boolean {
      if (!this.connection)
        return false;
  
      return this.connection.state === signalR.HubConnectionState.Connected
        || this.connection.state === signalR.HubConnectionState.Connecting
        || this.connection.state === signalR.HubConnectionState.Reconnecting;
    }
  
  }

  
const signalRService = new SignalRService();

export default signalRService;