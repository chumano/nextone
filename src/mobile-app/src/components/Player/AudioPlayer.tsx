import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AudioRecorderPlayer, { PlayBackType } from 'react-native-audio-recorder-player';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_THEME } from '../../constants/app.theme';
interface AudioPlayerProps {
    url: string,
    durationMiliSeconds? : number,
    onPlaying? : (id: string)=>void,
    id: string,
    playingId?: string,
}

const audioRecorderPlayer =new AudioRecorderPlayer();

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
    url, durationMiliSeconds, onPlaying , playingId,id
}) => {
    //const audioRecorderPlayerRef = useRef<AudioRecorderPlayer>();
    const [playing, setPlaying] = useState(false);
    const [currentPositionSec, setcurrentPositionSec] = useState(0);
    const durationRef = useRef<number|undefined>(durationMiliSeconds);
    const [time, setTime] = useState('Ghi âm');
    
   //const audioRecorderPlayer = audioRecorderPlayerRef.current;

    useEffect(() => {
        //audioRecorderPlayerRef.current = new AudioRecorderPlayer();
        audioRecorderPlayer?.setSubscriptionDuration(1);
    }, [])

    useEffect(()=>{
        if(!audioRecorderPlayer) return;
        if(!durationMiliSeconds){
            return;
        }
        const remainTimeStr  = audioRecorderPlayer.mmss( Math.floor(durationMiliSeconds/1000))
        setTime(remainTimeStr);
    },[durationMiliSeconds, audioRecorderPlayer])


    useEffect(()=>{
        if(playingId !== undefined && id!== playingId && playing){
            //force stop
            onStop();
        }
    },[playingId,id, playing])
    const onPlay = useCallback(async ()=>{
        if(!audioRecorderPlayer) return;
        setPlaying(true);
        try{
            await audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
    
            const msg = await audioRecorderPlayer.startPlayer(url);
            audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
                //console.log(`addPlayBackListener ${id}`,e)
                const duration = e.duration;
                const remainTimeMiliSeconds = duration - e.currentPosition;
                const remainTimeStr =audioRecorderPlayer.mmss( Math.floor(remainTimeMiliSeconds/1000))
                setcurrentPositionSec(e.currentPosition);
                setTime(remainTimeStr);
                durationRef.current= duration;
    
                //check stop condition
                if(remainTimeMiliSeconds===0){
                    onStop();
                }
              });
        }catch(error){
            console.error('onPlay', error)
        }
      
    },[url, id, audioRecorderPlayer])

    const onStop = useCallback(async ()=>{
        if(!audioRecorderPlayer) return;
        setPlaying(false);
        try {
            if(durationRef.current) setTime(audioRecorderPlayer.mmss(Math.floor(durationRef.current/1000)))
            audioRecorderPlayer.removePlayBackListener();
            await audioRecorderPlayer.stopPlayer();
        } catch (error) {
            console.error('onStop', error)
        }
      
    },[audioRecorderPlayer])

  
    const onTogglePlay = useCallback(async() => {
        if(playing){
            //stop
            onStop();
            return;
        }
        //start play
        onPlaying && onPlaying(id);
        setTimeout(()=>{
            onPlay()
        },500)
    }, [playing, onStop, onPlay, onPlaying ])
    return <View style={styles.container}>
        <TouchableOpacity style={[styles.playBtn]}
            onPress={onTogglePlay}  >
            <MaterialCommunityIcon name={playing? 'stop' :'play'} size={32} color={APP_THEME.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.txt}>{time}</Text>
    </View>
}

export default AudioPlayer

const styles = StyleSheet.create({
    container: {
        flexDirection :'row',
        alignItems: 'center'
    },
    playBtn: {

    },
    txt: {
        color: 'black'
    }

})