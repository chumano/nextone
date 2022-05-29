import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { DeviceInfo, DeviceManager } from '../../services/DeviceManager';
import { callActions, IAppStore } from '../../store';

const deviceManager = new DeviceManager();
const ModalDeviceSettings = () => {
    const dispatch = useDispatch();

    const { deviceSettings } = useSelector((o: IAppStore) => o.call);

    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const [videoInputDevices, setVideoInputDevices] = useState<DeviceInfo[]>([]);
    const [audioInputDevices, setaudioInputDevices] = useState<DeviceInfo[]>([]);
    const [audioOuputDevices, setAudioOutputDevices] = useState<DeviceInfo[]>([]);

    useEffect(() => {
        const fetchDevices = async () => {
            const devices = await deviceManager.enumerateDevices();
            const videoInputs = devices.filter(o => o.type == 'videoinput');
            const audioInputs = devices.filter(o => o.type == 'audioinput');
            const audioOutputs = devices.filter(o => o.type == 'audiooutput');
            console.log({
                devices,
                videoInputs,
                audioInputs,
                //audioOutputs
            })
            setVideoInputDevices(videoInputs)
            setaudioInputDevices(audioInputs)
            setAudioOutputDevices(audioOutputs);
        }
        fetchDevices();
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            "videoInput": deviceSettings?.videoInputId || '',
            "audioInput": deviceSettings?.audioInputId || '',
            "audioOutput": deviceSettings?.audioOutputId || '',
        })
    }, [form, deviceSettings])


    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };

    const handleCancel = () => {
        hideModal();
    };

    const hideModal = () => {
        dispatch(callActions.showModal({ modal: 'device', visible: false }));
    }

    const onFormFinish = useCallback(async (values: any) => {
        setIsLoading(true);

        const videoInputId = values['videoInput'];
        const audioInputId = values['audioInput'];
        const audioOutputId = values['audioOutput'];
        console.log({ videoInputId, audioInputId, audioOutputId })

        dispatch(callActions.setDeviceSettings({ videoInputId, audioInputId, audioOutputId }));

        setIsLoading(false);
        hideModal();
    }, [form]);

    return <Modal
        title={'Cấu hình thiết bị'}
        visible={true}
        onCancel={handleCancel}
        footer={[
            <Button key="cancel" onClick={handleCancel}>
                Huỷ bỏ
            </Button>,
            <Button key="ok"
                onClick={handleOk}
                type="primary"
                disabled={
                    !form.isFieldsTouched(true) ||
                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }
                loading={isLoading}
            >
                Đồng ý
            </Button>,
        ]}
    >
        <Form onFinish={onFormFinish} form={form} layout='vertical'>

            <Form.Item name="videoInput" label="Camera"
                required tooltip=""
            >
                <Select style={{ width: '100%' }} >
                    {videoInputDevices.length === 0 &&
                        <Select.Option key={'none'} value={''}>{'Không nhận được Camera'}</Select.Option>
                    }
                    {videoInputDevices.length !== 0 &&
                        <>
                            <Select.Option key={'none'} value={''}>{'Tắt'}</Select.Option>
                            {videoInputDevices.map(o =>
                                <Select.Option key={o.id} value={o.id}>{o.name}</Select.Option>
                            )}
                        </>
                    }

                </Select>
            </Form.Item>

            <Form.Item name="audioInput" label="Microphone"
                required tooltip=""
            >
                <Select style={{ width: '100%' }} >
                    {audioInputDevices.length === 0 &&
                        <Select.Option key={'none'} value={''}>{'Không nhận được Microphone'}</Select.Option>
                    }
                    {audioInputDevices.length !== 0 &&
                        <>
                            <Select.Option key={'none'} value={''}>{'Tắt'}</Select.Option>
                            {audioInputDevices.map(o =>
                                <Select.Option key={o.id} value={o.id}>{o.name}</Select.Option>
                            )}
                        </>
                    }

                </Select>
            </Form.Item>

            {/* <Form.Item name="audioOutput" label="Speaker"
                required tooltip=""
            >
                <Select style={{ width: '100%' }} >
                    {audioOuputDevices.length === 0 &&
                        <Select.Option key={'none'} value={''}>{'Không nhận được Speaker'}</Select.Option>
                    }
                    {audioOuputDevices.length !== 0 &&
                        <>
                            <Select.Option key={'none'} value={''}>{'Tắt'}</Select.Option>
                            {audioOuputDevices.map(o =>
                                <Select.Option key={o.id} value={o.id}>{o.name}</Select.Option>
                            )}
                        </>
                    }

                </Select>
            </Form.Item> */}
        </Form>


    </Modal>
}

export default ModalDeviceSettings