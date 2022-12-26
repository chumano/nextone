import React, { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native';
import { Asset, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MediaItemType, MEDIA_TYPE } from '../../types/File/MediaItemType';
import { requestCameraPermission } from '../../utils/file.utils';

export interface ImageInfo{
    uri:string,
    fileName:string,
    type: string
}
interface IProps{
    onPicked: ( imgs :ImageInfo[]) => void
}
const ImageActionPicker :React.FC<IProps>= ({onPicked}) => {
    const onPickCallback = (assets: Asset[]|undefined)=>{
        if (!assets || assets.length===0) {
            return;
          }
        const images : MediaItemType[]= assets.map(file=>({
            name: `${Math.random()}-${file.fileName}`,
            uri: file.uri!,
            thumbnailUri: file.uri,
            type: file.type!,
            mediaType: MEDIA_TYPE.IMAGE,
            size: file.fileSize,
        }))
        //console.log('onPickCallback', images)

        const imgInfos = images.map(img=>({
                uri: img.uri,
                fileName: img.name,
                type: img.type
            }
        ));
        onPicked(imgInfos)
    }
    const pickImageLibrary = (async ( ) => {
        try{
            const options: ImageLibraryOptions = {
                mediaType: 'mixed',
                selectionLimit: 5,
              };
              const result = await launchImageLibrary(options);
              //console.log('pickImage' , result)
              //add UploadMessage
              const {assets} = result;
             
              
              onPickCallback(assets)
        }catch(err){
        }
      });

      const pickCamera = async ( ) => {
        await requestCameraPermission();
        const result = await launchCamera({
            cameraType: 'back',
            mediaType: 'mixed',
            includeExtra: true
        });
        //console.log('pickCamera', result)

        const { assets } = result;
       
        onPickCallback(assets);
    };
  return (
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
            onPress={pickCamera}>
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
            onPress={pickImageLibrary}>
            <MaterialCommunityIcon style={{
                color: 'black',
                fontSize: 80
            }}
                name="image-outline" />
        </TouchableOpacity>
    </View>
  )
}

export default ImageActionPicker