import { Modal } from "antd";
import { QuestionOutlined} from '@ant-design/icons';
import { User } from "oidc-client";
import { createContext,  useCallback, useEffect} from "react";
import { useDispatch } from "react-redux";
import { AuthenticationService } from "../../services";
import { CallEvents } from "../../services/CallBase";
import CallService from "../../services/CallService";
import { SignalR } from "../../services/SignalRService";
import { IAppStore, authActions, callActions } from "../../store";
import { chatActions } from "../../store/chat/chatReducer";

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
    
    useEffect(()=>{
        const singalRSubsription =SignalR.subscription('connected', async ()=>{
            await registerHub();
            CallService.init();
           
            const callrequestSubscription = CallService.listen(CallEvents.RECEIVE_CALL_REQUEST, 
                (data: {room:string, userId:string, userName: string})=>{
                //show user confirm
                Modal.confirm({
                    title: 'Có cuộc gọi đến',
                    icon: <QuestionOutlined />,
                    content: `Cuộc gọi từ "${data.userName}"`,
                    onOk : async ()=> {
                        dispatch(callActions.receiveCall({
                            conversationId: data.room
                        }))
                        await CallService.acceptCallRequest(data.room);
                    },
                    onCancel : async ()=> {
                        await CallService.ignoreCallRequest(data.room);
                    },
                });
            });
            callrequestSubscription.subscribe();
        });
        
        singalRSubsription.subscribe();

        const chatSubsription = SignalR.subscription('chat', (data)=>{
            console.log('SignalR-chat', data)
            dispatch(chatActions.receiveChatEvent(data))
        });
        chatSubsription.subscribe();

    },[dispatch]);

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