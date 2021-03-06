import { Avatar, Form, Input, Select } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import DataSourceAutocomplete from "../../components/DataSourceAutocomplete";
import DataSourceSelect from "../../components/DataSourceSelect";
import Modal from "../../components/modals/Modal";
import { DashStyle, DataSource, GeoType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { geo2LayerType } from "../../utils/functions";
import { LayerStyle } from "./useMapEditor";


interface ModalAddLayerProps {
    onLayerAdded: (layer: LayerStyle) => void;
    visible: boolean;
    onToggle: (visible: boolean) => void;
}

const getDefaultStyle = (geoType: GeoType) => {
    const commonStyle = {
         //text
        'text-enabled': false,
        'text-column': "",
        'text-color': "#000000",
        'text-font': "Arial",
        'text-size': 10,

        'text-halo-enabled': false,
        'text-halo-color': "#000000",
        'text-halo-width': 1,

        'text-rotate-enabled': false,
        'text-rorate-column': "",

        //common
        'outline-enabled': false,
        'outline-color': "#000000",
        'outline-width': 1,
        'outline-style': `${DashStyle.dash}`,
    }

    switch (geoType) {
        case GeoType.point:
            return {
                ...commonStyle,
                'circle-color': "#000000",
                'circle-size': 5,

                'symbol-enabled': false,
                'symbol-image': "",
                'symbol-scale': 1,
            }
        case GeoType.line:
            return {
                ...commonStyle,
                'line-color' :"#000000",
                'line-width' : 1,
                'line-style' : `${DashStyle.solid}`,
            }
        case GeoType.fill:
            return {
                ...commonStyle,
                'fill-transparent-enabled': false,
                'fill-color': "#000000",
                
                'theme-enabled': false,
                'theme-column': "",
                'theme-value-min': 0,
                'theme-value-max': 100,
                'theme-color1': "#000000",
                'theme-color2': "#000000",
                'theme-color3': "#000000",
            }

        default:
            return {
            }
    }

}
const ModalAddLayer: React.FC<ModalAddLayerProps> = (props) => {
    const [form] = Form.useForm();
    const sourceStore = useDatasourceStore();
    const { datasources } = sourceStore.datasourceState;
    const [messageError, setMessageError] = useState<string>();

    useEffect(()=>{
        setMessageError('');
    },[])
    
    const onFormFinish = async (values: any) => {
        //onLayerAdded
        const source = values['Source'] as {id:string, name:string, geoType: GeoType, dataSource: DataSource}
        if (!source) {
            setMessageError('Ch??a ch???n Source');
            return;
        }
        const dataSource = source.dataSource;
        if (!dataSource) {
            setMessageError('dataSource kh??ng x??c ?????nh');
            return;
        }

        const layerStyle: LayerStyle = {
            name: values['Name'],
            layerGroup: values['GroupName'],
            layerType: geo2LayerType(source?.geoType),
            sourceId: source.id,
            sourceName: source.name,
            dataSource: dataSource,
            visibility: true,
            note: values['Note'],
            minZoom: 1,
            maxZoom: 20,
            style: getDefaultStyle(source?.geoType)
        }

        props.onLayerAdded(layerStyle)
        props.onToggle(false);
    };
    return <>
        <Modal {...{
            title: 'Th??m layer',
            isOpen: props.visible,
            onOk: async () => {
                await form.validateFields(); //H??m n??y s??? throw error n???u c?? field ko h???p l???
                form.submit();
            },
            onCancel: () => { props.onToggle(false); }
        }}>
            {messageError &&
                <h6>{messageError}</h6>
            }
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
                    { min: 4, message: 'Name\'s length >= 4' }]}>
                    <Input placeholder="" autoComplete="newpassword" />
                </Form.Item>

                <Form.Item name="Source" label="Source" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Source is required' }]}>
                    <DataSourceAutocomplete datasources={datasources} />
                </Form.Item>

                <Form.Item name="GroupName" label="Group Name" tooltip="This is a required field"
                    rules={[{ min: 4, message: 'GroupName\'s length >= 4' }]}>
                    <Input placeholder="" autoComplete="newpassword" />
                </Form.Item>

                <Form.Item name="Note" label="Note" tooltip="This is a optional field">
                    <TextArea rows={4} placeholder="" maxLength={255} />
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalAddLayer;

