import { Form, Input, Select } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import TextArea from "antd/lib/input/TextArea";
import Modal from "../../components/modals/Modal";
import { GeoType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { LayerStyle } from "./useMapEditor";
//LayerType :'line' | 'fill' | 'point' | 'symbol' | string;
const geo2LayerType = (geoType? : GeoType)=> {
    switch(geoType){
        case GeoType.Point:
            return 'point';
        case GeoType.Line:
            return 'line';
        case GeoType.Fill:
            return 'fill';
    }
    return '';
}

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
        const source = datasources.find(o=> o.Id == values['Source'])

        const layerStyle : LayerStyle = {
            name: values['Name'],
            layerGroup:  values['GroupName'],
            layerType: geo2LayerType(source?.GeoType),
            visibility: true
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
                            {min: 5, message: 'Name\'s length >= 5'}]}>
                    <Input placeholder="input placeholder" autoComplete="newpassword" />
                </Form.Item>

                <Form.Item name="GroupName" label="GroupName" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'GroupName is required' },
                            {min: 5, message: 'GroupName\'s length >= 5'}]}>
                    <Input placeholder="input placeholder" autoComplete="newpassword" />
                </Form.Item>

                <Form.Item name="Source" label="Source" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Source is required' }]}>
                    <Select placeholder="Source" >
                        {datasources.map(o=>
                            <Select.Option key={o.Id} value={o.Id}>{o.Name} - {GeoType[o.GeoType]}</Select.Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item name="Note" label="Note" tooltip="This is a optional field">
                    <TextArea rows={4} placeholder="maxLength is 255" maxLength={255} />
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalAddLayer;