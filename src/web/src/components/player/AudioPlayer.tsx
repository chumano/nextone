import { Button } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
interface AudioPlayerProps {
    url: string,
    durationMiliSeconds?: number,
    onPlaying?: (id: string) => void,
    id: string,
    playingId?: string,
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
    url, durationMiliSeconds, onPlaying, playingId, id
}) => {
    const [playing, setPlaying] = useState(false);
    const [currentPositionSec, setCurrentPositionSec] = useState(-1);
    const durationRef = useRef<number | undefined>(durationMiliSeconds);
    const [time, setTime] = useState('Ghi âm');
    const audioRef = useRef<HTMLAudioElement>(null);
    const intervalRef = useRef<number>();

    useEffect(()=>{
        if(!durationRef.current) return;
        let remainTime = durationRef.current - currentPositionSec;
        remainTime = remainTime>0?remainTime:0;

        const timeStr = mmss(Math.floor(remainTime));
        console.log('currentTime:', currentPositionSec, durationRef.current, timeStr );
        setTime(timeStr);

    },[currentPositionSec, durationRef.current])

    const setIntervalWatch = useCallback(() => {
        intervalRef.current = window.setInterval(() => {
            if(!audioRef.current) return;
            setCurrentPositionSec(audioRef.current.currentTime)
            
        }, 1000);
    }, [audioRef.current]);

    const clearIntervalWatch = useCallback(() => {
        intervalRef.current && clearInterval(intervalRef.current);
        intervalRef.current = undefined;
    }, [])

    const onPlay = useCallback(() => {
        setPlaying(true);
        //audioRef.current?.currentTime = 0;
        audioRef.current?.play()
        setIntervalWatch();
    }, [audioRef.current, setIntervalWatch])

    const onStop = useCallback(() => {
        setPlaying(false);
        if(!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        if(durationRef.current) setTime(mmss(Math.floor(durationRef.current)))
        clearIntervalWatch();
    }, [audioRef.current, clearIntervalWatch])

    const onEnded = useCallback((e: Event) => {
        console.log('onEnded', e)
        setCurrentPositionSec(audioRef.current!.currentTime)
        onStop();
    }, [onStop]);

    const onMedataLoaded = useCallback((e: Event) => {
        durationRef.current = audioRef.current!.duration;
        setCurrentPositionSec(audioRef.current!.currentTime)
    }, [])

    useEffect(()=>{
        return ()=>{
            clearIntervalWatch();
        }
    },[clearIntervalWatch])

    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.addEventListener('ended', onEnded);

        audioRef.current.addEventListener('loadedmetadata', onMedataLoaded);

        return () => {
            if (!audioRef.current) return;
            audioRef.current.removeEventListener('ended', onEnded);
            audioRef.current.removeEventListener('loadedmetadata', onMedataLoaded)
        }
    }, [audioRef.current, onEnded, onMedataLoaded])

    useEffect(() => {
        if (playingId !== undefined && id !== playingId && playing) {
            //force stop
            onStop();
        }
    }, [playingId, id, playing])

    const onTogglePlay = useCallback(async () => {
        if (playing) {
            //stop
            onStop();
            return;
        }
        //start play
        onPlaying && onPlaying(id);
        setTimeout(() => {
            onPlay()
        }, 100)
    }, [playing, onStop, onPlay, onPlaying])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesomeIcon icon={playing ? faStop : faPlay}
                className="input-button clickable" style={{ marginRight: 10 }}
                onClick={onTogglePlay} />

            <audio ref={audioRef} autoPlay={false}>
                <source src={url} type="audio/mpeg" />
            </audio>
            <span>{time}</span>
        </div>
    )
}

export default AudioPlayer

const pad = (num: number): string => {
    return ('0' + num).slice(-2);
};
const mmss = (secs: number): string => {
    let minutes = Math.floor(secs / 60);

    secs = secs % 60;
    minutes = minutes % 60;

    return pad(minutes) + ':' + pad(secs);
};