import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { APP_THEME } from '../../constants/app.theme'
import { Message } from '../../types/Message/Message.type'
import { frowNow } from '../../utils/date.utils'
import { groupFileByType } from '../../utils/file.utils'
import FileList from '../File/FileList'
import FileView from '../File/FileView'
import ImageView from "react-native-image-viewing";
import { ImageSource } from 'react-native-image-viewing/dist/@types'
import ImageViewHeader from '../ImageView/ImageViewHeader'
import ImageViewFooter from '../ImageView/ImageViewFooter'
import { useNavigation } from '@react-navigation/native'

interface MessageEventProps {
    message: Message
}
const MessageEvent: React.FC<MessageEventProps> = ({ message }) => {
    const navigation = useNavigation<any>();
    const eventInfo = message.event!;
    const group = useMemo(() => {
        return groupFileByType(eventInfo?.files || []);
    }, [eventInfo])

    const [imageViewVisible, setImageViewVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
    const [images, setImages] = useState<ImageSource[]>([])

    const onViewImage = useCallback((index: number) => {
        const images = group['image'];
        return () => {
            const imageSoruces: ImageSource[] = images.map(o=> {
                return {
                    title: 'Hình ảnh',
                    uri: o.fileUrl
                }
            })
            setImages(imageSoruces);
            setSelectedImageIndex(index);
            setImageViewVisible(true);
        }
    }, [group])

    const onViewEvent = useCallback(()=>{
        // navigation.navigate('EventTab', {
        //     screen: 'EventDetailScreen',
        //     params: {
        //         eventInfo: eventInfo
        //     }
        //   });
        navigation.navigate( 'ChatEventDetailScreen',
            {
                eventInfo: eventInfo
            }
        );
    },[eventInfo])

    const displayDate = frowNow(message.sentDate);
    return (
        <React.Fragment>
            <View style={styles.messageContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onViewEvent}>
                        <Text style={styles.headerText}>{eventInfo.eventType.name}</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.sender}>
                    <Text >{message.userSender.userName} </Text>
                    <Text>{' - '}</Text>
                    <Text >{eventInfo.occurDate}</Text>
                </View>

                <View style={styles.content}>
                    <Text>
                        {eventInfo.content}
                    </Text>
                </View>

                {eventInfo.files && eventInfo.files.length > 0 &&
                    <View >
                        {group['image'].length > 0 &&
                            <View style={styles.imagesContainer}>
                                <FileList
                                    isHorizontal={true}
                                    renderItem={o => (
                                        <FileView file={o.item} onView={onViewImage(o.index)} 
                                            hiddenName={true}/>
                                    )}
                                    keyExtractorHandler={(item, _) => item.fileId}
                                    listFile={group['image']}
                                />
                            </View>
                        }
                        {group['other'].length > 0 &&
                            <View style={styles.filesContainer}>
                                <FileList
                                    isHorizontal={true}
                                    renderItem={o => (
                                        <View>
                                            <FileView file={o.item} hiddenName={true} />
                                            <Text numberOfLines={2} style={styles.fileName}>
                                                {o.item.fileName}
                                            </Text>
                                        </View>

                                    )}
                                    keyExtractorHandler={(item, _) => item.fileId}
                                    listFile={group['other']}
                                />
                            </View>
                        }
                    </View>
                }


                <View style={styles.displayDateContainer} >
                    <Text style={styles.displayDateText} >{displayDate}</Text>
                </View>

            </View>

            <ImageView
                backgroundColor='white'
                images={images}
                imageIndex={selectedImageIndex}
                visible={imageViewVisible}
                onRequestClose={() => setImageViewVisible(false)}
                HeaderComponent={({ imageIndex }) => {
                          const title = (images[imageIndex] as any).title;
                          return (
                            <ImageViewHeader title={title} onRequestClose={() => setImageViewVisible(false)} />
                          );
                        }
                  }
                FooterComponent={({ imageIndex }) => (
                <ImageViewFooter imageIndex={imageIndex} imagesCount={images.length} />
                )}
            />
        </React.Fragment>
    )
}

export default React.memo(MessageEvent)


const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: 'column',
        padding: 10,
        borderWidth: 1,
        borderColor: APP_THEME.colors.black,
        borderRadius: 20,
        margin: 20
    },
    header: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        textAlign: 'center',
        padding: 5,
    },
    sender: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        opacity: 0.5
    },

    imagesContainer: {
        padding: 5,
    },
    filesContainer: {
        padding: 5,
    },
    fileName: {
        maxWidth: 164,
        flexDirection: 'row',
    },

    displayDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    displayDateText: {
        fontSize: 10,
        opacity: 0.5
    }
});
