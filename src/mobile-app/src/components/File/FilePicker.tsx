import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { List, Text } from "react-native-paper";
import RNFetchBlob from "rn-fetch-blob";
import ImagePicker, { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MediaItemType, MEDIA_TYPE } from "../../types/File/MediaItemType";
import { requestCameraPermission } from "../../utils/file.utils";



interface MediaReviewType {
    Id: number | string;
    Path: string;
    Thumbnail?: string;
    Type: MEDIA_TYPE;
}

interface Props {
    onFileChanged?: (medias: MediaItemType[]) => void;
}


const MAXIMUM_NUMBER_OF_FILES = 3;
export const MAXIMUM_UPLOAD_SIZE = 50000000;


export const getMediaType = (fileType: string) => {
    const splitedArr = fileType.split('/');

    switch (splitedArr[0]) {
        case 'video':
            return MEDIA_TYPE.VIDEO;

        case 'image':
            return MEDIA_TYPE.IMAGE;

        default:
            throw new Error('Unsupported file');
    }
};

export const getMediaSize = async (media: MediaItemType) => {
    let fileSize = media.size;
    let uri = media.uri;

    if (Platform.OS === 'ios') {
        uri = uri.replace('file:', '');
    }

    if (!fileSize) {
        fileSize = (await RNFetchBlob.fs.stat(uri)).size;
    }

    return fileSize;
};


const FilePiker = (
    { onFileChanged: onPickMedia}: Props
) => {
    const [medias, setMedias] = useState<MediaItemType[]>([]);
    const totalSize = useRef(0);
    
    const pickMediaCallback = async (addedMedias: MediaItemType[]) => {
        if(addedMedias.length==0) return;

        let newMedias = [...medias];
        for(let i = 0; i< addedMedias.length; i++){
            const newMedia = addedMedias[i];
            const fileSize = await getMediaSize(newMedia);

            if (fileSize + totalSize.current > MAXIMUM_UPLOAD_SIZE) {
                Alert.alert(
                    "Có lỗi",
                    "Chỉ cho phép tối đa 50MB",
                    [
                        {
                            text: "Đóng",
                        },
                    ],
                    { cancelable: true },
                );
                break;
            }

            if (newMedias.length +1 > MAXIMUM_NUMBER_OF_FILES) {
                Alert.alert(
                    "Có lỗi",
                    `Chỉ cho phép gửi tối đa ${MAXIMUM_NUMBER_OF_FILES} hình`,
                    [
                        {
                            text: "Đóng",
                        },
                    ],
                    { cancelable: true },
                );
                break;
            }
            
            newMedias.splice(medias.length - 1, 0, newMedia);
            totalSize.current = fileSize + totalSize.current;
            
        }
            
        setMedias(newMedias);
        onPickMedia && onPickMedia(newMedias);
    };

    const removeItem = async (media: MediaItemType) => {
        const fileSize = await getMediaSize(media);

        totalSize.current = totalSize.current - fileSize;
        let newMedias = medias.filter((ele) => ele.name !== media.name);
        setMedias(newMedias);
        onPickMedia && onPickMedia(newMedias);
    };

    const getMedias = () => {
        if (medias.length < MAXIMUM_NUMBER_OF_FILES) {
            return medias.slice(0, medias.length - 1);
        } else {
            return medias;
        }
    };

    const onMediaPress = (media: MediaItemType) => {
        const selectedMedia: MediaReviewType = {
            Id: media.uri,
            Path: media.uri,
            Thumbnail: media.uri,
            Type: media.mediaType,
        };

        const allMedias = medias
            .filter((media) => media.uri)
            .map(
                (media) =>
                ({
                    Id: media.uri,
                    Path: media.uri,
                    Thumbnail: media.thumbnailUri,
                    Type: media.mediaType,
                } as MediaReviewType),
            );

        //Actions.mediaReviewScreen({ selectedMedia, medias: allMedias });
    };
    const pickImage = async (callback: (images: MediaItemType[]) => void) => {
        const result = await launchImageLibrary({
            mediaType: 'mixed',
            selectionLimit: 5
        });
        //console.log('pickImage', result)

        const { assets } = result;
        if (!assets) {
            return;
        }

        const items: MediaItemType[] = []
        for (let i = 0; i < assets.length; i++) {
            const file = assets[i];
            const newImage: MediaItemType = {
                name: `${Math.random()}-${file.fileName}`,
                uri: file.uri!,
                thumbnailUri: file.uri,
                type: file.type!,
                mediaType: MEDIA_TYPE.IMAGE,
                size: file.fileSize,
            };
            items.push(newImage);
        }

        callback(items);
    };

    const pickCamera = async (
        callback: (image: MediaItemType[]) => void) => {
        await requestCameraPermission();
        const result = await launchCamera({
            cameraType: 'back',
            mediaType: 'mixed',
            includeExtra: true
        });
        //console.log('pickCamera', result)

        const { assets } = result;
        if (!assets) {
            return;
        }
        for (let i = 0; i < assets.length && i < 1; i++) {
            const file = assets[i];
            const newImage: MediaItemType = {
                name: `${Math.random()}-${file.fileName}`,
                uri: file.uri!,
                thumbnailUri: file.uri,
                type: file.type!,
                mediaType: MEDIA_TYPE.IMAGE,
                size: file.fileSize,
            };
            callback([newImage]);
        }
    };
    return (
        <View style={{
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}>
                <TouchableOpacity
                    style={{
                        width: 100
                    }}
                    onPress={() => pickCamera(pickMediaCallback)}>
                    <MaterialCommunityIcon style={{
                        color: 'black',
                        fontSize: 80
                    }}
                        name="camera-outline" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        width: 100
                    }}
                    onPress={() => pickImage(pickMediaCallback)}>
                    <MaterialCommunityIcon style={{
                        color: 'black',
                        fontSize: 80
                    }}
                        name="image-outline" />
                </TouchableOpacity>
            </View>
            <FlatList
                keyExtractor={(item: MediaItemType) => item.name}
                data={medias}
                renderItem={(dataItem) => {
                    const { item } = dataItem;
                    return (
                        <MediaItem
                            item={item}
                            onRemoveItem={removeItem}
                            onItemPress={onMediaPress}
                        />
                    );
                }}
                horizontal={true}
            />
        </View>

    );
};

export default FilePiker;


interface MediaItemProps {
    item: MediaItemType;
    onRemoveItem: (image: MediaItemType) => void;
    onItemPress?: (image: MediaItemType) => void;
}
const MediaItem = ({ item, onRemoveItem, onItemPress }: MediaItemProps) => {
    const styles = mediaItemStyle;

    const onPress = () => {
        if (onItemPress) {
            onItemPress(item);
        }
    };

    return (
        <TouchableOpacity style={{
            ...styles.wrapper,
            width: 150,
            height: 150
        }} onPress={onPress}>
            {item.thumbnailUri ? (
                <Image source={{ uri: item.thumbnailUri }} style={styles.image} />
            ) : (
                <Image source={require('../../assets/video.png')} style={styles.image} />
            )}

            <TouchableOpacity
                style={styles.trashIconWrapper}
                onPress={() => onRemoveItem(item)}
            >
                <MaterialCommunityIcon name="close-circle-outline"
                    style={[styles.trashIcon]} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    addMediaButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    normalButton: {
        width: '90@ms0.25',
        height: '90@ms0.25',
    },
    smalButton: {
        width: '40@ms0.25',
        height: '40@ms0.25',
    },
});

const mediaItemStyle = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginRight: 5,
    },

    image: {
        width: '100%',
        height: '100%',
    },
    trashIconWrapper: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    trashIcon: {
        color: 'red',
        fontSize: 30
    },
})
