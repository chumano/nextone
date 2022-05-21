import { Icon } from 'antd'
import React from 'react'
import { BaseFile } from '../../../models/file/File.model'
import { FileType } from '../../../models/file/FileType.model'

interface FileViewProps{
    file: BaseFile
}
const FileView: React.FC<FileViewProps> = ({file}) => {
  return (
    <div className='file-view'>
        {file.fileType === FileType.Image &&
            <div className='file-view__image-container'>
                <img src={file.fileUrl} onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    //currentTarget.src="error";
                }}/>
            </div>
        }
        {file.fileType !== FileType.Image &&
            <div className='file-view__other-container'>
                <Icon type="file-zip" style={{fontSize:'30px'}}/>
            </div>
        }
    </div>
  )
}

export default FileView