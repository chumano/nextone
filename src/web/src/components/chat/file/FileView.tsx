import { FileZipOutlined, DownloadOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import React from 'react'
import { BaseFile } from '../../../models/file/File.model'
import { FileType } from '../../../models/file/FileType.model'
import { IMAGE_FALLBACK } from '../../../utils';

interface FileViewProps {
    file: BaseFile,
    hiddenName?: boolean
}
const FileView: React.FC<FileViewProps> = ({ file, hiddenName }) => {
    return (
        <div className='file-view'>
            <div>
                <div className='file-view__preview'>
                    {file.fileType === FileType.Image &&
                        <div className='file-view__image-container'>
                            {/* <img src={file.fileUrl} onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        //currentTarget.src="error";
                    }}/> */}
                            <Image width={"100%"} height={"100%"} src={file.fileUrl} fallback={IMAGE_FALLBACK} />
                        </div>
                    }
                    {file.fileType !== FileType.Image &&
                        <div className='file-view__other-container'>
                            <FileZipOutlined style={{ fontSize: '30px' }} />

                        </div>
                    }

                    <a href={file.fileUrl + "?download=" + file.fileName} title="Tải xuống"
                        download={file.fileName || 'download'}
                        className="button-icon button-download"
                        style={{ position: 'absolute', top: 10, left: 10 }}>
                        <DownloadOutlined />
                    </a>
                </div>
            </div>
            {!hiddenName &&
                <div>
                    {file.fileName}
                </div>
            }
        </div>
    )
}

export default React.memo(FileView)