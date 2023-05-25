import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {hasLocationPermission} from '../../utils/location.utils';
import Geolocation from 'react-native-geolocation-service';
import {Appbar, Button, Text, TextInput} from 'react-native-paper';

import {APP_THEME} from '../../constants/app.theme';
import {eventApi} from '../../apis/event.api';
import {EventSendRouteProp, EventStackProps} from '../../navigation/EventStack';
import FilePiker from '../../components/File/FilePicker';
import {fileApi} from '../../apis/fileApi';
import {BaseFile} from '../../types/File/BaseFile.type';
import {nowDate} from '../../utils/date.utils';
import {MediaItemType} from '../../types/File/MediaItemType';

const SendEventScreen = () => {
  const [eventCodeType, setEventCodeType] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<MediaItemType[]>([]);
  const [userInput, setUserInput] = useState<{
    content: string;
    address: string;
  }>({
    content: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<EventStackProps>();
  const route = useRoute<EventSendRouteProp>();

  useLayoutEffect(() => {
    //console.log('SendEventScreen-params', route.params)
    const {eventType} = route.params;
    navigation.setOptions({
      header: props => {
        return (
          <Appbar.Header
            style={{
              backgroundColor: APP_THEME.colors.primary,
            }}>
            {props.back && (
              <Appbar.BackAction
                color={APP_THEME.colors.accent}
                onPress={() => {
                  props.navigation.goBack();
                }}
              />
            )}
            <Appbar.Content
              title={`Sự kiện : ${eventType.name}`}
              color={APP_THEME.colors.accent}
              titleStyle={styles.title}
            />
          </Appbar.Header>
        );
      },
    });

    setEventCodeType(eventType.code);
  }, [navigation, route]);

  const getCoordinates = async (
    callback: (lat: number, lon: number) => void,
    errCallback: () => void,
  ) => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      Alert.alert('Cần cho phép lấy thông tin vị trí');
      errCallback();
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        callback(latitude, longitude);
      },
      e => {
        Alert.alert(`Code ${e.code}`, e.message);
        errCallback();
      },
      {
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
        enableHighAccuracy: false,
        forceRequestLocation: true,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  };

  const onUploadHandler = async () => {
    setIsLoading(true);
    getCoordinates(
      async (lat, lon) => {
        try {
          //update files
          let sendFileDTOs: BaseFile[] = [];
          if (selectedFiles.length > 0) {
            const files = selectedFiles.map(o => ({
              uri: o.uri,
              name: o.name,
              type: o.type,
            }));
            const uploadResponse = await fileApi.uploadFiles(
              files,
              progressEvent => {
                //console.log('upload_file', progressEvent.loaded, progressEvent)
                const progress = Math.round(
                  (100 * progressEvent.loaded) / progressEvent.total,
                );
                //setUploadProgress(progress);
              },
              'message',
            );

            if (!uploadResponse.isSuccess) {
              Alert.alert('Api Error', uploadResponse.errorMessage!);
            }

            sendFileDTOs = uploadResponse.data;
          }

          //send event
          const rs = await eventApi.sendEvent({
            Content: userInput.content,
            EventTypeCode: eventCodeType!,
            Address: userInput.address,
            Lat: lat,
            Lon: lon,
            OccurDate: nowDate(), //'15:20:00 02/07/2022',
            Files: sendFileDTOs,
          });

          setIsLoading(false);

          const data = rs.data;

          if (data.isSuccess) {
            //navigation.pop(2);
            navigation.navigate('EventScreen', {
              reload: true,
            });
            return;
          }

          Alert.alert('Api Error', data.errorMessage!);
        } catch (error) {
          Alert.alert('Something went wrong');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setIsLoading(false);
      },
    );
  };

  const onChangeTextInput = (updateField: string, updatedText: string) => {
    setUserInput(prevState => {
      if (!prevState) {
        return prevState;
      }
      return {
        ...prevState,
        [updateField]: updatedText,
      };
    });
  };

  const checkInputValid = useCallback(() => {
    return userInput.address === '' && userInput.content === '';
  }, [userInput.address, userInput.content]);

  const onFileChanged = useCallback(
    (files: MediaItemType[]) => {
      setSelectedFiles(files);
    },
    [setSelectedFiles],
  );
  return (
    <View style={styles.sendEventScreenContainer}>
      <View style={styles.sendEventForm}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Nội dung: </Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              style={styles.input}
              placeholderTextColor={APP_THEME.colors.accent}
              activeUnderlineColor={APP_THEME.colors.accent}
              autoCorrect={false}
              placeholder="Nhập nội dung"
              onChangeText={onChangeTextInput.bind(this, 'content')}
              value={userInput.content}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Địa chỉ: </Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              style={styles.input}
              placeholderTextColor={APP_THEME.colors.accent}
              activeUnderlineColor={APP_THEME.colors.accent}
              autoCorrect={false}
              placeholder="Nhập địa chỉ"
              onChangeText={onChangeTextInput.bind(this, 'address')}
              value={userInput.address}
            />
          </View>
        </View>

        <View style={styles.mediaPickerContainer}>
          <FilePiker onFileChanged={onFileChanged} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            labelStyle={{
              color: APP_THEME.colors.primary,
            }}
            style={{
              backgroundColor: checkInputValid()
                ? APP_THEME.colors.disabled
                : APP_THEME.colors.accent,
            }}
            mode="contained"
            onPress={onUploadHandler}
            loading={isLoading}
            disabled={checkInputValid()}>
            Gửi
          </Button>
        </View>
      </View>
    </View>
  );
};
export default SendEventScreen;

const styles = StyleSheet.create({
  sendEventScreenContainer: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  sendEventForm: {
    width: '100%',
    shadowOpacity: 1,
    shadowRadius: APP_THEME.rounded,
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowColor: APP_THEME.colors.backdrop,
    backgroundColor: APP_THEME.colors.primary,
    padding: APP_THEME.spacing.padding,
    borderRadius: APP_THEME.rounded,
  },
  inputContainer: {
    flexDirection: 'row',
    minHeight: 48,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    paddingHorizontal: 16,
  },
  valueContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 2 * APP_THEME.spacing.between_component,
  },
  labelText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: APP_THEME.spacing.between_component,
    backgroundColor: APP_THEME.colors.background,
  },
  title: {
    fontWeight: '500',
  },
  mediaPickerContainer: {
    marginVertical: APP_THEME.spacing.between_component,
  },
});
