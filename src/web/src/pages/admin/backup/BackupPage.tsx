import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, message, Modal, Space, Table, Tag } from 'antd';
import prettyBytes from 'pretty-bytes';
import React, { useCallback, useEffect, useState } from 'react'
import { userApi } from '../../../apis/userApi';
import { Backup, backupActions, BackupContextProvider, useBackupDispatch, useBackupSelector } from './backupContext';
import ModalBackupSchedule from './ModalBackupSchedule';

const BackupPageInternal = () => {
    const dispatch = useBackupDispatch();
    const { filters, backupList, count, backupSchedule } = useBackupSelector(o => o);
    const [showModalBackupSchedule, setShowModalBackupSchedule] = useState<boolean>(false);
    useEffect(() => {
        const fecthData = async () => {
            const listResponse = await userApi.getBackups();
           
            if (listResponse.isSuccess) {
                dispatch(backupActions.setBackupList(listResponse.data))
            }
        }

        fecthData();
    }, [filters])

    const fectchBackupScheduleData = useCallback(async ()=>{
        const response = await userApi.getBackupSchedule();
           
        if (response.isSuccess) {
            dispatch(backupActions.setBackupSchedule(response.data))
        }
    },[])
    useEffect(() => {
        fectchBackupScheduleData();
    }, [fectchBackupScheduleData])

    const onPaginationChange = (page: number, pageSize: number) => {
        dispatch(backupActions.setPagination({
            page,
            pageSize
        }))
    };
    const onBackup = useCallback(() => {
        Modal.confirm({
            title: `Bạn có muốn tạo backup dữ liệu không?`,
            onOk: async () => {
                   const response = await userApi.createBackup();
                   const { isSuccess, errorMessage } = response;
                   if (!isSuccess) {
                     Modal.error({
                       title: 'Có lỗi bất thường xảy ra!',
                       content: errorMessage
                     });
                     return;
                   }

                   //reload 
                   message.success("Đã tạo backup thành công")
                   dispatch(backupActions.setFilter({}));
            },
            onCancel() {
            },
        });
    }, [dispatch]);
    const onDelete = useCallback((item: Backup) => {
        Modal.confirm({
            title: `Bạn có muốn xóa "${item.name}" không?`,
            onOk: async () => {
                //    const response = await userApi.deleteUserActivity(item.id);
                //    const { isSuccess, errorMessage } = response;
                //    if (!isSuccess) {
                //      Modal.error({
                //        title: 'Có lỗi bất thường xảy ra!',
                //        content: errorMessage
                //      });
                //      return;
                //    }

                //    dispatch(backupActions.deleteUserActivity(item.id));

            },
            onCancel() {
            },
        });
    }, [dispatch]);

    return (
        <div className='backup-page'>
            <div className='backup-page__head'>
                <div>
                    <h5 >Backup dữ liệu</h5>
                </div>
            </div>
            <div className='backup-page__filter' 
                style={{paddingTop:10, paddingBottom:10, display:'flex', flexDirection:'row' }}>
                <div>
                    <Space>
                        <Button onClick={()=>{dispatch(backupActions.setFilter({}))}}>
                            Tải lại danh sách
                        </Button>

                        <Button type="default" danger 
                            title='Backup dữ liệu ngay lập tức'
                            onClick={onBackup}>
                            Backup
                        </Button>
                    </Space>
                   
                </div>
                <div className='flex-spacer'></div>
                {backupSchedule &&
                    <div >
                        <div>
                            Thời gian định kỳ backup (ngày): <Tag>{backupSchedule?.backupIntervalInDays}</Tag>
                        </div>
                        <div>
                            Số bản backup lưu giữ : <Tag>{backupSchedule?.keepNumber}</Tag>
                        </div>
                     </div>
                }
                {backupSchedule &&
                    <div>
                        <Button  onClick={()=>setShowModalBackupSchedule(true)} >
                            <FontAwesomeIcon icon={faCog}/>
                        </Button>
                    </div>   
                }
            </div>
            <div className='backup-page__body'>
                <div>	<Table
                    dataSource={backupList}
                    bordered
                    rowKey="name"
                    pagination={false}
                >
                    <Table.Column
                        title="#"
                        key="index"
                        render={(_, _1, index) => <span>{index + 1}</span>}
                    />
                    <Table.Column
                        title="Tên"
                        dataIndex="name"
                        key="name"
                    ></Table.Column>

                    <Table.Column
                        title="Thời gian"
                        dataIndex="createdDate"
                        key="createdDate"
                    ></Table.Column>


                    <Table.Column
                        title="Kích thước"
                        dataIndex="size"
                        key="size"
                        render={((size, record)=>(
                            <Tag>{prettyBytes(size)}</Tag>
                        ))}
                    ></Table.Column>

                    {/* <Table.Column
                        key="actions"
                        align="right"
                        render={(_, record: Backup) => (
                            <div className="list-button-actions">

                                <Button
                                    danger
                                    onClick={() => {
                                        onDelete(record);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>

                            </div>
                        )}
                    ></Table.Column> */}
                </Table>
                </div>
            </div>
            {showModalBackupSchedule && backupSchedule && <ModalBackupSchedule
                backupSchedule={backupSchedule}
                onClose={(isUpdate) => {
                    setShowModalBackupSchedule(false);
                    if (isUpdate) {
                        fectchBackupScheduleData();
                    }
                }} />}
        </div>
    )
}

const BackupPage = () => {
    return <BackupContextProvider>
      <BackupPageInternal />
    </BackupContextProvider>
  }

export default BackupPage