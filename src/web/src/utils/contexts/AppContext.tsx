import { Modal } from "antd";
import { QuestionOutlined } from '@ant-design/icons';
import { User } from "oidc-client";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthenticationService } from "../../services";
import { CallEvents } from "../../services/CallBase";
import CallService from "../../services/CallService";
import { SignalR } from "../../services/SignalRService";
import { IAppStore, authActions, callActions } from "../../store";
import { chatActions } from "../../store/chat/chatReducer";
import sound from '../sound';
import { CALL_WAIT_TIME } from "../constants/constants";
import { comApi } from "../../apis/comApi";
import { IApplicationSettings } from "../../models/AppSettings";


interface IGlobalData {
    applicationSettings?: IApplicationSettings
}
export const GlobalContext = createContext<IGlobalData>({} as any);

interface IContextProviderProp {
    children: React.ReactNode;
}


SignalR.connect('/hubChat');

const registerHub = async () => {
    const accessToken = await AuthenticationService.getAccessToken()
    if (!accessToken) return;
    const hubRegisterResult = await SignalR.invoke('register', accessToken);
    //console.log('hubRegisterResult', hubRegisterResult)
}

const AppContextProvider = (props: IContextProviderProp) => {
    const user = useSelector((store: IAppStore) => store.auth.user);
    const [globalData, setGlobalData] = useState<IGlobalData>({});

    useSignalRListen(globalData);
    useUserAuthentication();
    
    useEffect(()=>{
        if(!user) return;

        const fetchApplicationSettings = async()=>{
            const response = await comApi.getAppSettings();
            if(!response.isSuccess){
                return;
            }
            setGlobalData({
                applicationSettings: response.data
            })

        }
        fetchApplicationSettings();

    },[user])

    return <>
        <GlobalContext.Provider value={globalData}>
            {props.children}
        </GlobalContext.Provider>
    </>
}

export { AppContextProvider }


const useUserAuthentication = () => {
    const dispatch = useDispatch();
    const logIn = useCallback(async (user: User) => {
        dispatch(authActions.login(user));
        dispatch(chatActions.setUser(user.profile.sub));

        await registerHub();
    }, [dispatch]);

    const handleUserOnLoaded = () => (user: User) => {
        logIn(user);
    }

    const handleTokenExpired = () => async () => {
        dispatch(authActions.logout());
        await AuthenticationService.signinSilent();
    }

    const addOidcEvents = useCallback(() => {
        AuthenticationService.Events.addUserLoaded(handleUserOnLoaded());
        AuthenticationService.Events.addAccessTokenExpired(handleTokenExpired());
    }, [])

    const removeOidcEvents = useCallback(() => {
        AuthenticationService.Events.removeUserLoaded(handleUserOnLoaded());
        AuthenticationService.Events.removeAccessTokenExpired(handleTokenExpired());
    }, [])

    useEffect(() => {
        addOidcEvents();
        AuthenticationService.getAuthenticatedUser().then((user) => {
            if (user) {
                logIn(user);
            }
        });
        return () => {
            removeOidcEvents();
        }
    }, [addOidcEvents, removeOidcEvents])
}

const useSignalRListen = (globalData: IGlobalData) => {
    const dispatch = useDispatch();
    const [isCallInit, setCallInit] = useState(false);
    const [isHubConnected, setIsHubConnected] = useState(false);
    const listenTimeoutRef = useRef<any>();
    const {applicationSettings} = globalData;
    useEffect(() => {
        const singalRSubsription = SignalR.subscription('connected', async () => {
            await registerHub();
            setIsHubConnected(true);
        });

        singalRSubsription.subscribe();

        const chatSubsription = SignalR.subscription('chat', (data) => {
            //console.log('SignalR-chat', data)
            dispatch(chatActions.receiveChatEvent(data))
        });
        chatSubsription.subscribe();

    }, [dispatch]);

    useEffect(() => {
        if (isCallInit || !isHubConnected || !applicationSettings) {
            return;
        }
        console.log('%c ...................CALL INITED.............', 'color: #ff00ff')
        setCallInit(true);
        CallService.init();

        const callrequestSubscription = CallService.listen(CallEvents.RECEIVE_CALL_REQUEST,
            async (data: { room: string, userId: string, userName: string, callType: 'voice' | 'video' }) => {
                //show user confirm
                const { room, userName, callType } = data;
                sound.play();
                const modal = Modal.confirm({
                    title: 'Có cuộc gọi đến',
                    icon: <QuestionOutlined />,
                    content: `Cuộc gọi từ "${userName}"`,
                    onOk: async () => {
                        if (listenTimeoutRef.current) {
                            clearTimeout(listenTimeoutRef.current)
                            listenTimeoutRef.current = undefined
                        }
                        sound.stop();

                        dispatch(callActions.receiveCall({
                            conversationId: room,
                            callType: callType
                        }))

                        var rs = await CallService.acceptCallRequest(room, 
                            applicationSettings.iceServers,
                            {
                                audio: {
                                    enabled: true,
                                },
                                video: callType === 'video' ? {
                                    enabled: true
                                } : {
                                    enabled: false
                                }
                            });

                        if (rs.error) {
                            console.error('CallSession acceptCallRequest', rs);
                            await CallService.stopCall();
                            return
                        }

                    },
                    onCancel: async () => {
                        if (listenTimeoutRef.current) {
                            clearTimeout(listenTimeoutRef.current)
                            listenTimeoutRef.current = undefined
                        }
                        sound.stop();
                        await CallService.ignoreCallRequest(room);
                    },
                });

                //Tự động tắt sau 1 khoảng thời gian
                if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current)
                listenTimeoutRef.current = setTimeout(() => {
                    //end call
                    sound.stop();
                    if (modal) {
                        modal.destroy();
                    }
                }, applicationSettings.callTimeOutInSeconds*1000 || CALL_WAIT_TIME)
            });
        callrequestSubscription.subscribe();
    }, [isCallInit, isHubConnected, applicationSettings])
}