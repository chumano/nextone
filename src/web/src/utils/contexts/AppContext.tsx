import { Icon, Modal } from "antd";
import { constant } from "lodash";
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
           
            const callrequestSubscription = CallService.listen(CallEvents.RECEIVE_CALL_REQUEST, (room)=>{
                //show user confirm
                Modal.confirm({
                    title: 'Có cuộc gọi đến',
                    icon: <Icon type="question" />,
                    content: 'Cuộc gọi từ "Admin"',
                    onOk : async ()=> {
                        dispatch(callActions.receiveCall({
                            conversationId: room
                        }))
                        await CallService.acceptCallRequest(room);
                    },
                    onCancel : async ()=> {
                        await CallService.ignoreCallRequest(room);
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