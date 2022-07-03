import React, { useCallback } from 'react'
import { Alert, Image, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { BaseFile } from '../../types/File/BaseFile.type'
import { FileType } from '../../types/File/FileType.type'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal, Portal, Text } from 'react-native-paper';
import { APP_THEME } from '../../constants/app.theme';
import RNFetchBlob from 'rn-fetch-blob';
const { config, fs } = RNFetchBlob;

const checkPermission = async (callback: () => void) => {
    if (Platform.OS === 'ios') {
        callback();
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                callback();
                console.log('Storage Permission Granted.');
            } else {
                // If permission denied then show alert
                Alert.alert('Error', 'Storage Permission Not Granted');
            }
        } catch (err) {
            // To handle permission related exception
            console.log("++++" + err);
        }
    }
};


interface FileViewProps {
    file: BaseFile,
    hiddenName?: boolean,
    onView?: () => void
}
const FileView: React.FC<FileViewProps> = ({ file, hiddenName, onView }) => {
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const onOptionPress = () => {
        showModal();
    }
    const onDownload = useCallback(() => {
        checkPermission(() => {
            downloadFile(file)
        })
    }, [file]);


    const downloadFile = useCallback((file: BaseFile) => {
        const { fileUrl, fileName, fileType } = file
        let date = new Date();

        let RootDir = fs.dirs.PictureDir;
        if (fileType !== FileType.Image) {
            if (fileType === FileType.Video) {
                RootDir = fs.dirs.MovieDir
            } else {
                RootDir = fs.dirs.DocumentDir
            }
        }

        const filePath = RootDir + "/" +
            //'file_' +
            // Math.floor(date.getTime() + date.getSeconds() / 2) +
            fileName;

        console.log('download file path', filePath);

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

        config(options)
            .fetch('GET', fileUrl)
            .then((res: any) => {
                // Alert after successful downloading
                hideModal();
                console.log('res -> ', JSON.stringify(res));
            });
    }, []);

    const getFileExtention = (fileUrl: string) => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };

    return (
        <View>
            {file.fileType === FileType.Image &&
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={onView}>
                        <Image style={styles.image} source={{ uri: file.fileUrl }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.fileOptions} onPress={onOptionPress}>
                        <MaterialCommunityIcon name={"dots-horizontal"} size={24} color={'#000'} />
                    </TouchableOpacity>
                </View>
            }
            {file.fileType !== FileType.Image &&
                <View style={styles.fileContainer}>
                    <AwesomeIcon name='file-alt' size={32} color={'#000'} />
                    <TouchableOpacity style={styles.fileOptions} onPress={onOptionPress}>
                        <MaterialCommunityIcon name={"dots-horizontal"} size={24} color={'#000'} />
                    </TouchableOpacity>
                </View>
            }


            {!hiddenName &&
                <Text numberOfLines={1} style={styles.fileName}>
                    {file.fileName}
                </Text>
            }

            <Portal>
                <Modal visible={visible} onDismiss={hideModal}
                    style={styles.modal}
                    contentContainerStyle={styles.modalContent}>
                    <Text>Tải về máy</Text>
                    <Text style={{ opacity: 0.5 }}>{file.fileName}</Text>
                    <TouchableOpacity onPress={onDownload}>
                        <MaterialCommunityIcon name={"cloud-download-outline"} size={48} color={'#000'} />
                    </TouchableOpacity>
                </Modal>
            </Portal>

        </View>
    )
}

export default React.memo(FileView)


const styles = StyleSheet.create({
    modal: {

    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center'
    },

    fileOptions: {
        position: 'absolute',
        top: 0,
        right: 5
    },

    imageContainer: {
        width: 164,
        height: 164,
        padding: 5,
        borderWidth: 1,
        borderColor: APP_THEME.colors.black,
        borderRadius: 10,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%'
    },

    fileContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: APP_THEME.colors.black,
        borderRadius: 10,
        position: 'relative'

    },
    fileIcon: {
        width: '100%',
        height: '100%'
    },

    fileName: {
        maxWidth: 164,
        flexDirection: 'row',
    }

});
