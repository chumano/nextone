import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { BaseFile } from '../../types/File/BaseFile.type'

interface FileViewProps {
    file: BaseFile,
    hiddenName? :boolean
}
const FileView: React.FC<FileViewProps> = ({ file }) => {
    return (
        <View style={styles.eventImageContainer}>
            <Image style={styles.eventImage} source={{ uri: file.fileUrl }} />
        </View>
    )
}

export default React.memo(FileView)


const styles = StyleSheet.create({
    eventImageContainer: {
        width: 164,
        height: 164
    },
    eventImage: {
        width: '100%',
        height: '100%'
    }
});
