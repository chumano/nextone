import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {hasLocationPermission} from '../../utils/location.utils';
import Geolocation from 'react-native-geolocation-service';
import {Button, RadioButton} from 'react-native-paper';

import {APP_THEME} from '../../constants/app.theme';
import {eventApi} from '../../apis/event.api';

const eventList: {Code: string; Name: string}[] = [
  {Code: 'ANNINH', Name: 'An ninh'},
  {Code: 'THIENTAI', Name: 'Thiên tai'},
];

const SendEventScreen = () => {
  const [eventCodeType, setEventCodeType] = useState<string>(eventList[0].Code);
  const [latLon, setLatLon] = useState<
    | {
        lat: number;
        lon: number;
      }
    | undefined
  >(undefined);
  const [userInput, setUserInput] = useState<{
    content: string;
    address: string;
  }>({
    content: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getCoordinates = async () => {
      const hasPermission = await hasLocationPermission();

      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLatLon({
            lat: latitude,
            lon: longitude,
          });
        },
        e => Alert.alert(`Code ${e.code}`, e.message),
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

    getCoordinates();
  }, []);

  const onUploadHandler = async () => {
    if (!latLon) {
      Alert.alert('Need Location Permission');
      return;
    }

    setIsLoading(true);

    try {
      const rs = await eventApi.sendEvent({
        Content: userInput.content,
        EventTypeCode: eventCodeType,
        Address: userInput.address,
        Lat: latLon.lat,
        Lon: latLon.lon,
        OccurDate: '15:20:00 02/07/2022',
        Files: [],
      });

      setIsLoading(false);

      const data = rs.data;

      if (data.isSuccess) {
        navigation.goBack();
        return;
      }

      Alert.alert('Api Error', data.errorMessage as string);
      return;
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Something went wrong');
    }
  };

  const onChangeTextInput = (updateField: string, updatedText: string) => {
    setUserInput(prevState => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        [updateField]: updatedText,
      };
    });
  };

  const checkInputValid = useCallback(() => {
    return userInput.address === '' && userInput.content === '';
  }, [userInput.address, userInput.content]);

  return (
    <View style={styles.sendEventScreenContainer}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Content</Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              autoCorrect={false}
              placeholder="Your content"
              onChangeText={onChangeTextInput.bind(this, 'content')}
              value={userInput.content}
            />
          </View>
        </View>
        <View style={styles.eventTypeContainer}>
          <View style={[styles.labelContainer, {marginBottom: 8}]}>
            <Text style={styles.labelText}>Code</Text>
          </View>
          <View style={styles.radioButtonGroupContainer}>
            <RadioButton.Group
              value={eventCodeType}
              onValueChange={value => setEventCodeType(value)}>
              {eventList.map(type => (
                <RadioButton.Item
                  key={type.Code}
                  label={type.Name}
                  value={type.Code}
                  style={[styles.radioItem, {marginLeft: 16}]}
                  labelStyle={{marginLeft: -16}}
                />
              ))}
            </RadioButton.Group>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Address</Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              autoCorrect={false}
              placeholder="Your address"
              onChangeText={onChangeTextInput.bind(this, 'address')}
              value={userInput.address}
            />
          </View>
        </View>

        <View style={{marginVertical: 24}}>
          <Text style={{paddingHorizontal: 16}}>
            *TODO*: Attach File Feature
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onUploadHandler}
            loading={isLoading}
            disabled={checkInputValid()}>
            Upload
          </Button>
        </View>
      </View>
    </View>
  );
};
export default SendEventScreen;

const styles = StyleSheet.create({
  sendEventScreenContainer: {
    paddingVertical: 16,
    flex: 1,
  },
  formContainer: {flex: 1},
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: APP_THEME.colors.background,
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
  radioButtonGroupContainer: {
    backgroundColor: APP_THEME.colors.background,
  },
  eventTypeContainer: {
    marginVertical: 24,
  },
  buttonContainer: {
    marginTop: 40,
  },
  labelText: {},
  radioItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
  },
});
