import { Form, Input, Select } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import TextArea from "antd/lib/input/TextArea";
import Modal from "../../components/modals/Modal";
import { GeoType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { geo2LayerType } from "../../utils/functions";
import { LayerStyle } from "./useMapEditor";


interface ModalAddLayerProps{
    onLayerAdded: (layer: LayerStyle) =>void;
    visible: boolean;
    onToggle : (visible: boolean)=>void;
}
const ModalAddLayer: React.FC<ModalAddLayerProps> = (props) => {
    const [form] = Form.useForm();
    const sourceStore = useDatasourceStore();
    const {datasources} = sourceStore.datasourceState;

    const onFormFinish = async (values: any) => {
        //onLayerAdded
        const source = datasources.find(o=> o.id == values['Source'])
        if(!source){
            return;
        }

        const layerStyle : LayerStyle = {
            name: values['Name'],
            layerGroup:  values['GroupName'],
            layerType: geo2LayerType(source?.geoType),
            sourceId: source.id,
            visibility: true,
            note:  values['Note'],
        }

        props.onLayerAdded(layerStyle)
        props.onToggle(false);
    };
    return <>
        <Modal {...{
            title: 'Thêm layer',
            isOpen: props.visible,
            onOk: async () => {
                await form.validateFields(); //Hàm này sẽ throw error nếu có field ko hợp lệ
                form.submit();
            },
            onCancel: () => { props.onToggle(false); }
        }}>
            <Form form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
                initialValues={{ size: 'default', requiredMarkValue: 'required' }}
                onFinish={(onFormFinish)}
                size={'default' as SizeType}
            >
                <Form.Item name="Name" label="Name" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Name is required' },
                            {min: 4, message: 'Name\'s length >= 4'}]}>
                    <Input placeholder="input placeholder" autoComplete="newpassword" />
                </Form.Item>

                <Form.Item name="Source" label="Source" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Source is required' }]}>
                    <Select placeholder="Source" >
                        {datasources.map(o=>
                            <Select.Option key={o.id} value={o.id}>{o.name} - {GeoType[o.geoType]}</Select.Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item name="GroupName" label="Group Name"  tooltip="This is a required field"
                    rules={[{min: 4, message: 'GroupName\'s length >= 4'}]}>
                    <Input placeholder="input placeholder" autoComplete="newpassword" />
                </Form.Item>

                <Form.Item name="Note" label="Note" tooltip="This is a optional field">
                    <TextArea rows={4} placeholder="maxLength is 255" maxLength={255} />
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalAddLayer;

