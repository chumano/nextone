import { Modal } from "antd";
import { QuestionOutlined} from '@ant-design/icons';
import { User } from "oidc-client";
import { createContext,  useCallback, useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { AuthenticationService } from "../../services";
import { CallEvents } from "../../services/CallBase";
import CallService from "../../services/CallService";
import { SignalR } from "../../services/SignalRService";
import { IAppStore, authActions, callActions } from "../../store";
import { chatActions } from "../../store/chat/chatReducer";
import sound from '../sound';

export const GlobalContext = createContext<any>({});

interface IContextProviderProp {
    children: React.ReactNode;
}


SignalR.connect('/hubChat');

const registerHub = async ()=>{
    const accessToken = await AuthenticationService.getAccessToken()
    if(!accessToken)  return;
    const hubRegisterResult =await SignalR.invoke('register',accessToken);
    console.log('hubRegisterResult', hubRegisterResult)
}


const AppContextProvider = (props: IContextProviderProp) => {
    const dispatch = useDispatch();
    const [isCallInit,setCallInit] = useState(false);
    const [isHubConnected,setIsHubConnected] = useState(false);

    useEffect(()=>{
        const singalRSubsription =SignalR.subscription('connected', async ()=>{
            await registerHub();
            setIsHubConnected(true);
        });
        
        singalRSubsription.subscribe();

        const chatSubsription = SignalR.subscription('chat', (data)=>{
            console.log('SignalR-chat', data)
            dispatch(chatActions.receiveChatEvent(data))
        });
        chatSubsription.subscribe();

    },[dispatch]);

    useEffect(()=>{
        if(isCallInit || !isHubConnected){
            return;
        }
        console.log('%c ...................CALL INITED.............', 'color: #ff00ff')
        setCallInit(true);
        CallService.init();
       
        const callrequestSubscription = CallService.listen(CallEvents.RECEIVE_CALL_REQUEST, 
            (data: {room:string, userId:string, userName: string, callType: 'voice' | 'video'})=>{
            //show user confirm
            const {room,userName, callType} = data;
            sound.play();
            const modal = Modal.confirm({
                title: 'C?? cu???c g???i ?????n',
                icon: <QuestionOutlined />,
                content: `Cu???c g???i t??? "${userName}"`,
                onOk : async ()=> {
                    sound.stop();
                    dispatch(callActions.receiveCall({
                        conversationId: room,
                        callType : callType
                    }))
                    await CallService.acceptCallRequest(room,{
                        audio : {
                            enabled:true,
                        },
                        video : callType ==='video'? {
                            enabled: true
                        }: {
                            enabled:false
                        }
                    });
                },
                onCancel : async ()=> {
                    sound.stop();
                    await CallService.ignoreCallRequest(room);
                },
            });
            setTimeout(()=>{
                //end call
                sound.stop();
                if(modal){
                    modal.destroy();
                }
            },15000)
        });
        callrequestSubscription.subscribe();
    },[isCallInit,isHubConnected])

   const logIn = useCallback(
        (user: User) => {
            dispatch(authActions.login(user));
            dispatch(chatActions.setUser(user.profile.sub));
            registerHub();
    }, [dispatch]);

    const handleUserOnLoaded = ()=> (user: User)=>{
        logIn(user);
    }

    const handleTokenExpired = () => async ()=>{
        dispatch(authActions.logout());
        await AuthenticationService.signinSilent();
    }

    const addOidcEvents = useCallback(()=>{
        AuthenticationService.Events.addUserLoaded(handleUserOnLoaded());
        AuthenticationService.Events.addAccessTokenExpired(handleTokenExpired());
    },[])

    const removeOidcEvents = useCallback(()=>{
        AuthenticationService.Events.removeUserLoaded(handleUserOnLoaded());
        AuthenticationService.Events.removeAccessTokenExpired(handleTokenExpired());
    },[])

    useEffect(() => {
        addOidcEvents();
        AuthenticationService.getAuthenticatedUser().then( (user)=>{
            if(user){
                logIn(user);
            }
        });
        return () => {
            removeOidcEvents();
        }
    }, [addOidcEvents, removeOidcEvents])

    return <>
         {props.children}
    </>
}

export { AppContextProvider }