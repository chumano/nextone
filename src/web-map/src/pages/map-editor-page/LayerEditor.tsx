import { Collapse } from "antd";
import { useEffect, useState } from "react";
import {
  FieldId, FieldType, FieldSource,
  FieldMinZoom, FieldMaxZoom, FieldComment
} from "../../components/fields";
import { DataSource, GeoType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { LayerStyle, useMapEditor } from "./useMapEditor";

const AntDCollapse: any = Collapse;


const renderGroupType = (type: string, props: any, fields: any, datasources: DataSource[]) => {
  let comment = ""
  const layerSources = datasources.map(o=>{
    return  { 
      key: o.Id,
      name: `${o.Name} - ${GeoType[o.GeoType]}`
    }
  });
  if (!props.layer) {
    props.layer = {
      id: 'id',
      name: 'name',
      type: 'fill',
      source: 'source1'
    }
  }
  if (!props.sources) {
    props.sources = {};
  }
  switch (type) {
    case 'layer': return <div>
      <FieldId
        value={props.layer.id}
        onChange={() => { }}
      />
      <FieldType
        disabled={true}
        value={props.layer.type}
        onChange={() => { }}
      />
      {props.layer.type !== 'background'
        && <FieldSource
          sources={layerSources}
          value={props.layer.source}
          onChange={(key) => { }}
        />
      }

      <FieldMinZoom
        value={props.layer.minzoom}
        onChange={() => { }}
      />
      <FieldMaxZoom
        value={props.layer.maxzoom}
        onChange={() => { }}
      />
      <FieldComment
        value={comment}
        onChange={() => { }}
      />
    </div>

    //   case 'properties':
    //     return <PropertyGroup
    //       errors={errorData}
    //       layer={this.props.layer}
    //       groupFields={fields}
    //       spec={this.props.spec}
    //       onChange={this.changeProperty.bind(this)}
    //     />
    //   case 'jsoneditor':
    //     return <FieldJson
    //       layer={this.props.layer}
    //       onChange={(layer) => {
    //         this.props.onLayerChanged(
    //           this.props.layerIndex,
    //           layer
    //         );
    //       }}
    //     />
  }
}

const LayerEditor: React.FC = () => {
  const mapEditor = useMapEditor();
  const sourceStore = useDatasourceStore();

  const [layer, setLayer] = useState<LayerStyle>();
  const {datasources} = sourceStore.datasourceState;

  useEffect(()=>{
    const selectedIndex = mapEditor.mapEditorState.selectedLayerIndex || 0;
    const selectedLayer =  mapEditor.mapEditorState.layers[selectedIndex];
    setLayer(selectedLayer);

  }, [mapEditor.mapEditorState.layers, mapEditor.mapEditorState.selectedLayerIndex])

  if(!layer)
    return null;

  return <>
    <div className="layer-editor">
      <div className="layer-editor__header">
        <span> Layer: '{layer.name}'</span>
      </div>

      <AntDCollapse
        defaultActiveKey={['1', '2',]}
        onChange={(key: string | string[]) => { }}
        expandIconPosition={'right' as any}
      >
        <AntDCollapse.Panel header="Layer" key="1" >
          <div>
            {renderGroupType('layer', { id: 'abc' }, {}, datasources)}
          </div>
        </AntDCollapse.Panel>
        <AntDCollapse.Panel header="Paint properties" key="2">
          <div>
            Panel2
          </div>
        </AntDCollapse.Panel>
      </AntDCollapse>
    </div>
  </>
}

export default LayerEditor;