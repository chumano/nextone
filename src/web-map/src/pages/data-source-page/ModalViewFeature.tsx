import { Form, Input, Select, Tabs } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { features } from "process";
import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import { ColumnType, DataSource, DataSourceType, FeatureData, ShapeFileProps } from "../../interfaces";

import '../../styles/components/table.scss';

interface ModalViewFeatureProps {
    item: DataSource;
    visible: boolean;
    onToggle: (visible: boolean) => void;
}
const ModalViewFeature: React.FC<ModalViewFeatureProps> = (props) => {
    const { featureData, properties } = props.item;
    const featureCount = properties[ShapeFileProps.FEATURECOUNT];
    const columns = properties[ShapeFileProps.COLUMNS] as any[];
    const handleOk = async () => {
        props.onToggle(false);
    };

    return <>
        <Modal {...{
            width: 800,
            title: 'Thông tin dữ liệu',
            isOpen: props.visible,
            onOk: handleOk,
            onCancel: handleOk
        }}>
            <Tabs defaultActiveKey="column" tabPosition={'top'} style={{ height: 400 }}
                size={'large'}
            >
                <Tabs.TabPane tab={`Trường thông tin`} key={'column'} disabled={false}>
                    {/* columns */}
                    {columns && columns.length > 0 &&
                        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                            <table className="data">
                                <thead>
                                    {Object.keys(columns[0]).map(k =>
                                        <th key={k}>
                                            {k}
                                        </th>
                                    )}
                                </thead>
                                <tbody>
                                    {columns.map((o, index) =>
                                        <tr key={index}>
                                            {Object.keys(o).map(k =>
                                                <td key={k}>
                                                    {o[k]}
                                                </td>
                                            )}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    }
                </Tabs.TabPane>

                <Tabs.TabPane tab={`Dữ liệu chi tiết`} key={'data'} disabled={false}>
                    {/* features */}
                    {featureCount && !(featureData && featureData.length > 0) &&
                        <>
                            Có {featureCount} dữ liệu
                            <br />
                            Số lượng data {">"} 1000 nên không hiển thị
                        </>

                    }
                    {featureData && featureData.length > 0 &&
                        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                            <table className="data">
                                <thead>
                                    {Object.keys(featureData[0]).map(k =>
                                        <th key={k}>
                                            {k}
                                        </th>
                                    )}
                                </thead>
                                <tbody>
                                    {featureData.map((o, index) =>
                                        <tr key={index}>
                                            {Object.keys(o).map(k =>
                                                <td key={k}>
                                                    {o[k]}
                                                </td>
                                            )}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    }
                </Tabs.TabPane>


            </Tabs>

        </Modal>
    </>
}

export default ModalViewFeature;