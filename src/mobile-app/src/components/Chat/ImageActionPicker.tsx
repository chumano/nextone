import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Asset,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MEDIA_TYPE, MediaItemType} from '../../types/File/MediaItemType';
import {requestCameraPermission} from '../../utils/file.utils';
import {APP_THEME} from '../../constants/app.theme';
import {Text} from 'react-native-paper';

export interface ImageInfo {
  uri: string;
  fileName: string;
  type: string;
}
interface IProps {
  onPicked: (imgs: ImageInfo[]) => void;
}
const ImageActionPicker: React.FC<IProps> = ({onPicked}) => {
  const onPickCallback = (assets: Asset[] | undefined) => {
    if (!assets || assets.length === 0) {
      return;
    }
    const images: MediaItemType[] = assets.map(file => ({
      name: `${Math.random()}-${file.fileName}`,
      uri: file.uri!,
      thumbnailUri: file.uri,
      type: file.type!,
      mediaType: MEDIA_TYPE.IMAGE,
      size: file.fileSize,
    }));
    //console.log('onPickCallback', images)

    const imgInfos = images.map(img => ({
      uri: img.uri,
      fileName: img.name,
      type: img.type,
    }));
    onPicked(imgInfos);
  };
  const pickImageLibrary = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'mixed',
        selectionLimit: 5,
      };
      const result = await launchImageLibrary(options);
      //console.log('pickImage' , result)
      //add UploadMessage
      const {assets} = result;

      onPickCallback(assets);
    } catch (err) {}
  };

  const pickCamera = async () => {
    await requestCameraPermission();
    const result = await launchCamera({
      cameraType: 'back',
      mediaType: 'mixed',
      includeExtra: true,
    });
    //console.log('pickCamera', result)

    const {assets} = result;

    onPickCallback(assets);
  };
  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity style={styles.pickerItem} onPress={pickCamera}>
        <Text style={styles.pickerItemText}>Chụp ảnh</Text>
        <MaterialCommunityIcon
          size={64}
          color={APP_THEME.colors.accent}
          name="camera-outline"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.pickerItem} onPress={pickImageLibrary}>
        <Text style={styles.pickerItemText}>Chọn hình ảnh</Text>
        <MaterialCommunityIcon
          size={64}
          color={APP_THEME.colors.accent}
          name="image-outline"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: APP_THEME.spacing.between_component,
  },
  pickerItem: {
    borderColor: `${APP_THEME.colors.black}3a`,
    borderWidth: 1,
    borderRadius: APP_THEME.rounded,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  pickerItemText: {
    marginBottom: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '100',
  },
});

export default ImageActionPicker;
