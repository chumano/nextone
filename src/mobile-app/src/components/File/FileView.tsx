import React, {useCallback} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {BaseFile} from '../../types/File/BaseFile.type';
import {FileType} from '../../types/File/FileType.type';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal, Portal, Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';
import RNFetchBlob from 'rn-fetch-blob';

const {config, fs} = RNFetchBlob;

const checkPermission = async (callback: () => void) => {
  if (Platform.OS === 'ios') {
    callback();
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        callback();
        //console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        Alert.alert('Error', 'Cần cho phép quyền lưu dữ liệu'); //'Storage Permission Not Granted');
      }
    } catch (err) {
      // To handle permission related exception
      //console.log("++++" + err);
    }
  }
};

interface FileViewProps {
  file: BaseFile;
  hiddenName?: boolean;
  onView?: () => void;
}
const FileView: React.FC<FileViewProps> = ({file, hiddenName, onView}) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onOptionPress = () => {
    showModal();
  };
  const onDownload = useCallback(() => {
    checkPermission(() => {
      downloadFile(file);
    });
  }, [file]);

  const downloadFile = useCallback((file: BaseFile) => {
    const {fileUrl, fileName, fileType} = file;
    let date = new Date();

    let RootDir =
      Platform.OS === 'android' ? fs.dirs.PictureDir : fs.dirs.DocumentDir;
    if (fileType !== FileType.Image) {
      if (fileType === FileType.Video) {
        RootDir =
          Platform.OS === 'android' ? fs.dirs.MovieDir : fs.dirs.DocumentDir;
      } else {
        RootDir =
          Platform.OS === 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir;
      }
    }

    const filePath =
      RootDir +
      '/' +
      //'file_' +
      // Math.floor(date.getTime() + date.getSeconds() / 2) +
      fileName;

    //console.log('download file path', filePath);

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: filePath,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };

    hideModal();
    config(options)
      .fetch('GET', fileUrl)
      .then((res: any) => {
        // Alert after successful downloading
        //console.log('res -> ', JSON.stringify(res));
      });
  }, []);

  const getFileExtention = (fileUrl: string) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  return (
    <View>
      {file.fileType === FileType.Image && (
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={onView}>
            <Image style={styles.image} source={{uri: file.fileUrl}} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fileOptions} onPress={onOptionPress}>
            <MaterialCommunityIcon
              name={'dots-horizontal'}
              size={24}
              color={APP_THEME.colors.accent}
            />
          </TouchableOpacity>
        </View>
      )}
      {file.fileType !== FileType.Image && (
        <View style={styles.fileContainer}>
          <AwesomeIcon
            name="file-alt"
            size={24}
            color={APP_THEME.colors.text}
          />
          <TouchableOpacity style={styles.fileOptions} onPress={onOptionPress}>
            <MaterialCommunityIcon
              name={'dots-horizontal'}
              size={24}
              color={APP_THEME.colors.accent}
            />
          </TouchableOpacity>
        </View>
      )}

      {!hiddenName && (
        <Text numberOfLines={1} style={styles.fileName}>
          {file.fileName}
        </Text>
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitleText}>Tải về máy</Text>
          </View>
          <View style={styles.fileNameContainer}>
            <Text style={styles.fileNameText}>{file.fileName}</Text>
          </View>
          <TouchableOpacity
            style={styles.downloadContainer}
            onPress={onDownload}>
            <MaterialCommunityIcon
              name={'cloud-download'}
              size={48}
              color={APP_THEME.colors.primary}
            />
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
};

export default React.memo(FileView);

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: APP_THEME.colors.background,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },

  fileOptions: {
    position: 'absolute',
    top: -5,
    right: 0,
  },

  imageContainer: {
    width: 164,
    height: 164,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: `${APP_THEME.colors.black}3a`,
    borderRadius: APP_THEME.rounded,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: APP_THEME.rounded,
  },

  fileContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${APP_THEME.colors.black}3a`,
    borderRadius: APP_THEME.rounded,
    position: 'relative',
  },

  fileIcon: {
    width: '100%',
    height: '100%',
  },

  fileName: {
    maxWidth: 164,
    flexDirection: 'row',
  },

  /* Modal */

  modalTitleContainer: {
    marginBottom: APP_THEME.spacing.between_component,
  },

  modalTitleText: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'normal',
    color: APP_THEME.colors.accent,
  },
  fileNameContainer: {
    marginBottom: 2 * APP_THEME.spacing.between_component,
  },
  fileNameText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  downloadContainer: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: APP_THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
