import { Collapse } from "antd";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  FieldId, FieldType, FieldSource,
  FieldMinZoom, FieldMaxZoom, FieldComment
} from "../../components/fields";
import { DataSource, GeoType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { LayerStyle, useMapEditor } from "./useMapEditor";

const AntDCollapse: any = Collapse;


const LayerEditor: React.FC = () => {
  const mapEditor = useMapEditor();
  const sourceStore = useDatasourceStore();

  const [layer, setLayer] = useState<LayerStyle>();
  const { datasources } = sourceStore.datasourceState;

  useEffect(() => {
    const selectedIndex = mapEditor.mapEditorState.selectedLayerIndex || 0;
    const selectedLayer = mapEditor.mapEditorState.layers[selectedIndex];
    setLayer(selectedLayer);

  }, [mapEditor.mapEditorState.layers, mapEditor.mapEditorState.selectedLayerIndex])

  const changeProperty = useCallback((property: string, newValue: any) => {
    const selectedIndex = mapEditor.mapEditorState.selectedLayerIndex || 0;
    mapEditor.onLayerPropertyChange(selectedIndex,
      property, newValue)
  },[ mapEditor.mapEditorState.selectedLayerIndex]);

  const renderGroupType = useCallback((type: string, layerProps: LayerStyle, fields: any) => {
    const layerSources = datasources.map(o => {
      return {
        key: o.Id,
        name: `${o.Name} - ${GeoType[o.GeoType]}`
      }
    });

    switch (type) {
      case 'layer': return <div>
        <FieldId
          value={layerProps.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { 
            changeProperty('name', e.target.value);
          }}
        />

        <FieldType
          disabled={true}
          value={layerProps.layerType}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            changeProperty('layerType', e.target.value);
          }}
        />

        <FieldSource
          disabled={true}
          sources={layerSources}
          value={layerProps.sourceId || ''}
          onChange={(sourceId) => {
            changeProperty('sourceId', sourceId);
           }}
        />

        <FieldMinZoom
          value={layerProps.minZoom}
          onChange={(val:any) => {
            changeProperty('minZoom', val);
          }}
        />
        <FieldMaxZoom
          value={layerProps.maxZoom}
          onChange={(val:any) => {
            changeProperty('maxZoom', val);
          }}
        />
        <FieldComment
          value={layerProps.note}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { 
            changeProperty('note', e.target.value);
          }}
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
  }, [layer, datasources]);


  if (!layer)
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
            {renderGroupType('layer', { ...layer }, {})}
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