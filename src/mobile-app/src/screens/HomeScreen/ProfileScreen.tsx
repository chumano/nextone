import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert, Platform} from 'react-native';
import {Avatar, Text, TextInput, Button, Portal, Modal, HelperText} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {APP_THEME} from '../../constants/app.theme';

import Loading from '../../components/Loading';

import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {getMyProfile} from '../../stores/user';

import {HomeStackProps} from '../../navigation/HomeStack';
import { userApi } from '../../apis/user.api';
import { logout } from '../../stores/auth';

export const ProfileScreen = ({navigation}: HomeStackProps) => {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((store: IAppStore) => store.user);
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  const changeProfileHandler = () => {
    navigation.navigate('DetailsScreen');
  };

  const changePasswordHandler = () => {
    navigation.navigate('ChangePasswordScreen');
  };
  const [visible, setVisible] = React.useState(false);

  const hideModal = () => setVisible(false);

  const deleteUserHanlder = () =>{
    setVisible(true);
  }
  
  if (userState.status === 'loading' || !userState.data) return <Loading />;

  return (
    <SafeAreaView style={styles.profileContainer}>
      <View style={styles.userAvatarContainer}>
        <Avatar.Icon icon="account" size={72}></Avatar.Icon>
        <View style={styles.userNameContainer}>
          <Text style={styles.userNameText}>{userState.data.name}</Text>
        </View>
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Email</Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput disabled defaultValue={userState.data.email}></TextInput>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Số điện thoại</Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput disabled defaultValue={userState.data.phone}></TextInput>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={changeProfileHandler}>
            Cập nhật thông tin
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={changePasswordHandler}>
            Đổi mật khẩu
          </Button>
        </View>

        <View style={{...styles.buttonContainer, width:'auto'}}>
          <Button mode="outlined" color='red' onPress={deleteUserHanlder}>
            Xóa tài khoản
          </Button>
        </View>
      </View>

      {Platform.OS ==='ios' &&
        <DeleteUserModal visible={visible} hideModal={hideModal}/>
      }
    </SafeAreaView>
  );
};

const DeleteUserModal :React.FC<{visible: boolean, hideModal: ()=>void}> = ({visible,hideModal})=>{
  const dispatch: AppDispatch = useDispatch();
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [password, setPassword] = useState<any>({
      value: '',
      isValid: true,
      errorMessage :undefined
    })
  const onDelete = async ()=>{
    if(password.value.trim().length===0){
      setPassword( (state:any)=>({
        ...state,
        isValid: false
      }))
      return;
    }

    const response = await userApi.selfDelete(password.value);
    console.log("selfDelete ressponse:" , response)
    if(!response.isSuccess){
      Alert.alert('Có lỗi', response.errorMessage!)
      return;
    }

    setPassword( (state:any)=>({
      ...state,
      isValid: false,
      errorMessage : response.errorMessage
    }))
    Alert.alert('Xóa tài khoản thàng công')
    hideModal();
    dispatch(logout());
  }

  return <Portal>
  <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
    <Text style={{fontSize:20}}>Bạn có muốn xóa tài khoản?</Text>
    <View
      style={{
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
    />
    <Text style={{color:'grey'}}>Xác nhận mật khẩu để xóa</Text>
    <View style={styles.inputContainer}>
      <TextInput style={{ width: '100%'}}
          label="Mật khẩu"
          secureTextEntry
          value={password.value}
          error={!password.isValid}
          onChangeText={(txt)=> setPassword({
            value: txt,
            isValid: true
          })}
        />
        {!password.isValid && 
          <HelperText type="error" style={{ width: '100%'}}>
            {password.errorMessage || 'Mật khẩu phải nhập!'}
          </HelperText>
        }
    </View>
    
    <Button color='red' onPress={onDelete}>
        Xóa
    </Button>
  </Modal>
</Portal>
}

const styles = StyleSheet.create({
  profileContainer: {
    paddingTop: 16,
  },
  userAvatarContainer: {
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderColor: APP_THEME.colors.placeholder,
  },
  userNameContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  userInfoContainer: {
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,

    borderBottomWidth: 0.5,
    borderColor: APP_THEME.colors.placeholder,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  valueContainer: {
    flex: 1,
  },
  buttonsContainer: {
    marginHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  labelText: {
    fontWeight: '200',
  },
  userNameText: {
    fontSize: 24,
  },
});
