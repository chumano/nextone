import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {updateMyProfile} from '../../stores/user/user.thunk';

import {User} from '../../types/User/User.type';

export const DetailsScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((store: IAppStore) => store.user);
  const [userInfo, setUserInfo] = useState<User | null>(userState.data);
  const [isDisabled, setIsDisabled] = useState(true);

  if (!userInfo) return <></>;

  const onChangeTextInput = (updateField: string, updatedText: string) => {
    if (!userInfo) return;

    setUserInfo(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        [updateField]: updatedText,
      };
    });

    setIsDisabled(false);
  };

  const updateProfileHandler = () => {
    dispatch(updateMyProfile({name: userInfo.name, phone: userInfo.phone}));
  };

  const {name, email, phone} = userInfo;

  return (
    <View style={styles.detailsScreenContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={name}
          right={<TextInput.Icon name="pencil" />}
          onChangeText={onChangeTextInput.bind(this, 'name')}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput label="Email" value={email} disabled />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          keyboardType="number-pad"
          label="Phone"
          value={phone}
          right={<TextInput.Icon name="pencil" />}
          onChangeText={onChangeTextInput.bind(this, 'phone')}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button
            disabled={isDisabled}
            mode="contained"
            onPress={updateProfileHandler}
            loading={userState.status === 'loading'}>
            Update
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsScreenContainer: {
    marginTop: 8,
    padding: 8,
  },
  inputContainer: {
    paddingVertical: 8,
  },
  buttonsContainer: {},
  buttonContainer: {
    marginTop: 16,
  },
});
