import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import {APP_THEME} from '../../constants/app.theme';

interface AudioRecorderProps {
  recordingEnabled: boolean;
  onRecorded?: (uri: string) => void;
}

const MAX_SECONDS = 120;
const AudioRecorder: React.FC<AudioRecorderProps> = ({
  recordingEnabled,
  onRecorded,
}) => {
  const audioRecorderPlayerRef = useRef<AudioRecorderPlayer>();

  const [recordTime, setRecordTime] = useState<string>('Ghi âm');
  const [recordMiliSecs, setRecordMiliSecs] = useState(0);
  const [rercording, setRecording] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    audioRecorderPlayerRef.current = new AudioRecorderPlayer();
    audioRecorderPlayerRef.current.setSubscriptionDuration(1);

    return () => {
      setRecording(undefined);
    };
  }, []);

  useEffect(() => {
    if (recordingEnabled) {
      requestPermissions();
    }
  }, [recordingEnabled]);

  useEffect(() => {
    if (recordingEnabled) {
      Keyboard.dismiss();
    }
  }, [recordingEnabled]);

  const onRecordFinished = useCallback(
    async (uri: string, recordMiliSecs: number) => {
      //console.log('onRecordFinished...', recordMiliSecs)
      try {
        if (recordMiliSecs > 100) {
          onRecorded && onRecorded(uri);
        }
      } catch (err) {
        console.error('onRecordFinished Error', err);
      }
    },
    [onRecorded],
  );

  const stopRecord = useCallback(async () => {
    //console.log('stopRecord...')
    setRecording(false);
    try {
      const audioRecorderPlayer = audioRecorderPlayerRef.current;
      if (!audioRecorderPlayer) {
        return;
      }

      const uri = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();

      //console.log('recorded uri: ', uri)

      onRecordFinished(uri, recordMiliSecs);
    } catch (error) {
      console.error('onStopRecord Error', error);
    }

    setRecordMiliSecs(0);
    setRecordTime('Ghi âm');
  }, [recordMiliSecs, onRecordFinished]);

  const onStartRecord = useCallback(async () => {
    //console.log('onStartRecord...')

    const audioRecorderPlayer = audioRecorderPlayerRef.current;
    if (!audioRecorderPlayer) {
      return;
    }

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    //console.log('audioSet', audioSet);

    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      // ios: undefined,
      // android: undefined,

      // Discussion: https://github.com/hyochan/react-native-audio-recorder-player/discussions/479
      // ios: 'https://firebasestorage.googleapis.com/v0/b/cooni-ebee8.appspot.com/o/test-audio.mp3?alt=media&token=d05a2150-2e52-4a2e-9c8c-d906450be20b',
      // ios: 'https://staging.media.ensembl.fr/original/uploads/26403543-c7d0-4d44-82c2-eb8364c614d0',
      ios: 'audio_recorded.m4a',
      android: `${dirs.DownloadDir}/audio_recorded.mp3`,
    });

    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    //console.log('startRecorder uri', uri)

    setRecording(true);
    setRecordMiliSecs(0);
    setRecordTime('00:00');
    audioRecorderPlayer.removeRecordBackListener();
    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      const timeStr = audioRecorderPlayer.mmss(
        Math.floor(e.currentPosition / 1000),
      );
      //console.log({timeStr, currentPosition: e.currentPosition})
      setRecordMiliSecs(e.currentPosition);
      setRecordTime(timeStr);

      if (e.currentPosition > MAX_SECONDS * 1000) {
        stopRecord();
      }
    });
  }, [stopRecord]);

  const onStopRecord = useCallback(async () => {
    //console.log('onStopRecord...')
    stopRecord();
  }, [stopRecord]);

  return (
    <>
      {recordingEnabled && (
        <>
          <View style={styles.recordCounterContainer}>
            <Text style={styles.recordCounterText}>{recordTime}</Text>
          </View>
          <View style={styles.recordingContainer}>
            <TouchableOpacity
              style={styles.recordingButton}
              onPressIn={onStartRecord}
              onPressOut={onStopRecord}>
              <MaterialCommunityIcon
                name="microphone"
                size={64}
                color={APP_THEME.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({
  recordingContainer: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    padding: 10,
    borderRadius: APP_THEME.rounded,
    backgroundColor: APP_THEME.colors.accent,
  },

  recordCounterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordCounterText: {
    fontSize: 32,
    lineHeight: 36,
    textAlignVertical: 'center',
    fontWeight: '100',
  },
});

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await requestRecordPermissions();
    if (!granted) {
      return;
    }
  }
};

const requestRecordPermissions = async () => {
  try {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    //console.log('write external stroage', grants);

    if (
      grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      //console.log('permissions granted');
      return true;
    } else {
      //console.log('All required permissions not granted');

      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
