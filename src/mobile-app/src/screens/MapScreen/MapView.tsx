import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Platform } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { conversationApi } from '../../apis';
import { eventApi } from '../../apis/event.api';
import { APP_CONFIG } from '../../constants/app.config';
import { IAppStore } from '../../stores/app.store';
import { conversationActions } from '../../stores/conversation';
import { ConversationType } from '../../types/Conversation/ConversationType.type';
import { EventInfo } from '../../types/Event/EventInfo.type';
import { UserStatus } from '../../types/User/UserStatus.type';
import { getConversationName } from '../../utils/conversation.utils';
import { MapConfig, parseMapConfig } from '../../utils/mapUtils';
//https://github.com/pavel-corsaghin/react-native-leaflet/blob/main/src/LeafletView/index.tsx
const LEAFLET_HTML_SOURCE = Platform.select({
    ios: require('../../../android/app/src/main/assets/leaflet.html'),
    android: { uri: 'file:///android_asset/leaflet.html' },
});

interface MapViewProps {
    onMapInited?: () => void;
    eventInfos?: EventInfo[],
    users?: UserStatus[],
    zoomPosition?:[number, number],
    currentPosition?:[number, number]
}
const MapView: React.FC<MapViewProps> =
     ({zoomPosition, currentPosition, eventInfos,users, onMapInited }) => {
    const dispatch = useDispatch();
    const { data: userInfo } = useSelector((store: IAppStore) => store.auth);
    const navigation = useNavigation<any>();
    const webViewRef = useRef<WebView>(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const [mapConfig, setMapConfig] = useState<MapConfig>();
    const [mapTileUrl, setMapTileUrl] = useState<string>();

    const [userModalVisible, setUserModalVisible] = useState(false); 
    const [eventModalVisible, setEventModalVisible] = useState(false); 

    const fetchSettings = useCallback(async () => {
        const resposne = await conversationApi.getSettings();
        if (resposne.isSuccess) {
            const appSettings = resposne.data;
            const mapConfig = parseMapConfig(appSettings);
            

            if (mapConfig.layers.length > 0) {
                const { url } = mapConfig.layers[0];
                const tileMapUrl = APP_CONFIG.MAP_HOST + url;
                setMapTileUrl(tileMapUrl);
            }

            setMapConfig(mapConfig);
        }
    }, [conversationApi]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings])

    useEffect(() => {
        if (!initialized || !mapConfig) return;

        sendInitialMessage();
    }, [initialized, mapConfig])

    useEffect(() => {
        if (!initialized || !mapConfig|| !zoomPosition) return;
        setTimeout(()=>{
            sendMessage({
                type: 'ZOOMTO',
                data: zoomPosition
            });
        },500)
       
    }, [initialized, mapConfig,zoomPosition ])

    const sendMessage = useCallback( (payload: any) => {
        if(!webViewRef.current) return;
        //console.log(`[sending]: ${JSON.stringify(payload)}`);
        const run1 = `
        if(window.postMessage) {
            alert("postMessage")
            window.postMessage(${JSON.stringify(payload)}, '*');
        }
        `;
        const run = `
        if(MapManager) {
            MapManager.onMessage(${JSON.stringify(payload)})
        }
        `;
        webViewRef.current.injectJavaScript(
            run +
            `true;`
        );
    }, [webViewRef.current]);

    useEffect(()=>{
        if (!initialized || !mapConfig) return;
        if(!users && !eventInfos) return;
        //console.log("users, eventInfos change................")
        //console.log({users, eventInfos})
        const userList = users?.filter(o=> o.lastLat!=null && o.lastLon!=null).map(o=>{
            return {
                position : [o.lastLat, o.lastLon],
                type: 'user',
                user: {
                    userId: o.userId,
                    userName: o.userName,
                    lastUpdate: o.lastUpdateDate
                }
            }
        }) || [];
        
        const eventList = eventInfos?.map(o=>{
            return {
                position : [o.lat, o.lon],
                type: 'event',
                event: {
                    eventId: o.id,
                    eventTypeName: o.eventType.name,
                    content: o.content,
                    occurDate: o.occurDate,
                    userSenderName: o.userSender.userName
                }
            }
        }) || [];

        sendMessage({
            type: 'MARKERS',
            data: [...userList, ...eventList]
        });
    },[initialized,mapConfig, users, eventInfos, sendMessage])

    const showUserInfo = useCallback(async (userId:string)=>{
        if( userInfo!.userId == userId){
            Alert.alert("Không thể nhắn tín với chính mình")
            return;
        }
        //onpen chat
        //get conversation
        const response = await conversationApi.getOrCreateConversation({
            type: ConversationType.Peer2Peer,
            memberIds: [userId],
            name: ''
        })

        if (!response.isSuccess) {
            Alert.alert(response.errorMessage|| 'Có lỗi bất thường')
            console.error(response.errorMessage)
            return;
        }

        const conversationRepsonse = await conversationApi.getConversation(response.data);
        if (!conversationRepsonse.isSuccess) {
            Alert.alert(response.errorMessage|| 'Có lỗi bất thường')
            console.error(conversationRepsonse.errorMessage)
            return;
        }
        const conversation = conversationRepsonse.data;
        if(!response.isSuccess){
            return;
        }

        console

        const conversationName = getConversationName(conversation, userInfo!.userId);
        dispatch(conversationActions.selectConversation(conversation.id));
        navigation.navigate('ChatTab', {
            screen: 'ChatScreen',
            params: {
                conversationId:  conversation.id,
                name: conversationName,
                conversationType: conversation.type
            }
          });
    },[userInfo])

    const showEventInfo = useCallback(async (eventId:string)=>{
        //get eventInfo
        const eventInfo = eventInfos?.find(o=>o.id === eventId);
        //console.log('showEventInfo',{eventInfo})
        if(!eventInfo){
            return;
        }

        navigation.navigate( 'MapEventDetailScreen',
            {
                eventInfo: eventInfo
            }
        );
       
    },[navigation,eventInfos])

    const sendInitialMessage = useCallback(() => {
        if (!mapConfig) return;
        const config :any =  {
            ...mapConfig,
            mapTileUrl,
            debugEnabled: false
        }
        delete config['layers'];
        let startupMessage: any = {
            type: 'MAPCONFIG',
            data: config
        };

        sendMessage(startupMessage);
    }, [sendMessage, mapConfig, mapTileUrl]);


    const handleMessage = useCallback(
        (event: WebViewMessageEvent) => {
            const msg = event?.nativeEvent?.data;
            if (!msg) {
                return;
            }
            const message: {
                type: 'MAP_READY' | 'ON_VIEW',
                data: any
            } = JSON.parse(msg);

            //console.log(`handleMessage: ${JSON.stringify(message)}`);

            if (message.type === 'MAP_READY') {
                setInitialized(true);
                onMapInited && onMapInited();
            }
            if (message.type === 'ON_VIEW') {
                const {object, objectId} = message.data;
                if(object === 'user'){
                    showUserInfo(objectId)
                }else{
                    showEventInfo(objectId)
                }
            }
        }, [sendInitialMessage, showEventInfo, showUserInfo]);

    const webView = useMemo(()=>{
        //console.log("WEBVIEW change................")
        return <WebView
            originWhitelist={['*']}
            source={LEAFLET_HTML_SOURCE}
            ref={webViewRef}
            javaScriptEnabled={true}

            style={{ position: 'relative' }}

            onLoadStart={() => {
                setLoading(true);
            }}
            onLoad={() => {
                setTimeout(() => {
                    setLoading(false);
                }, 100);
            }}
            onMessage={handleMessage}
        />
    },[webViewRef, setLoading , handleMessage])
   


    return (<>
        {webView}
    </>)
}

export default MapView