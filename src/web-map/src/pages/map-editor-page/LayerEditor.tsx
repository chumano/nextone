import { Collapse } from "antd";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  FieldId, FieldType, FieldSource,
  FieldMinZoom, FieldMaxZoom, FieldComment
} from "../../components/fields";
import { getPropertiesConfigForType } from "../../config/paintPropertiesConfig";
import { DataSource, GeoType, LayerType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { capitalize } from "../../utils/functions";
import { useDebounce } from "../../utils/hooks";
import PaintPropertyGroup from "./PaintPropertyGroup";
import { LayerStyle, useMapEditor } from "./useMapEditor";

const AntDCollapse: any = Collapse;

const  getLayoutGroups = (layerType:LayerType)=> {
  const layerGroup = {
    name: 'Layer',
    type: 'layer',
    properties : [] as string[]
  }

  const groupsOfType = getPropertiesConfigForType(layerType);
  const painGroups = groupsOfType.groups.map(
    o => {
      return {
        ...o,
        type:'properties'
      }
    }
  );
  
  return [layerGroup,]
    .concat(painGroups)
}

const LayerEditor: React.FC = () => {
  const mapEditor = useMapEditor();
  const sourceStore = useDatasourceStore();

  const [layer, setLayer] = useState<LayerStyle>();
  const { datasources } = sourceStore.datasourceState;

  useEffect(() => {
    const selectedIndex = mapEditor.mapEditorState.selectedLayerIndex || 0;
    const selectedLayer = mapEditor.mapEditorState.layers[selectedIndex];
    setLayer(selectedLayer);

  }, [mapEditor.mapEditorState.layers,
     mapEditor.mapEditorState.selectedLayerIndex])

  
  const changePropertyFunc = useCallback((property: string, newValue: any) => {
    const selectedIndex = mapEditor.mapEditorState.selectedLayerIndex || 0;
    mapEditor.onLayerPropertyChange(selectedIndex,
      property, newValue)
  }, [mapEditor.mapEditorState.selectedLayerIndex]);

  const changeProperty = useDebounce(changePropertyFunc, 300);

  const changeStylePropertyFunc = useCallback((property: string, newValue: any) => {
    const selectedIndex = mapEditor.mapEditorState.selectedLayerIndex || 0;
    mapEditor.onLayerStyleChange(selectedIndex,
      property, newValue)
  }, [mapEditor.mapEditorState.selectedLayerIndex]);

  const changeStyleProperty =  useDebounce(changeStylePropertyFunc, 300);

  const renderGroupType = useCallback((type: 'layer' | 'properties' | string, 
    layerProps: LayerStyle, fields: any) => {
    const layerSources = datasources.map(o => {
      return {
        key: o.id,
        name: `${o.name} - ${GeoType[o.geoType]}`
      }
    });

    switch (type) {
      case 'layer': return <div>
        <FieldId
          value={layerProps.name}
          onChange={(val: any) => {
            changeProperty('name', val);
          }}
        />

        <FieldType
          disabled={true}
          value={layerProps.layerType}
          onChange={(val:any) => {
            changeProperty('layerType',val);
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
          onChange={(val: any) => {
            changeProperty('minZoom', val);
          }}
        />
        <FieldMaxZoom
          value={layerProps.maxZoom}
          onChange={(val: any) => {
            changeProperty('maxZoom', val);
          }}
        />
        <FieldComment
          value={layerProps.note}
          onChange={(val:any) => {
            changeProperty('note', val);
          }}
        />
      </div>

    case 'properties':
          return <PaintPropertyGroup
            layerStyle={layer!.style || {}}
            paintProperties={fields}
            onChange={changeStyleProperty}
           />

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

  const layoutGroups = getLayoutGroups(layer.layerType);

  return <>
    <div className="layer-editor">
      <div className="layer-editor__header">
        <span> Layer: '{layer.name}'</span>
      </div>

      <div className="layer-editor__body">
        <AntDCollapse
          defaultActiveKey={['0','1']}
          onChange={(key: string | string[]) => { }}
          expandIconPosition={'right' as any}
        >
          {layoutGroups.map( (group, index)=>{
            return <AntDCollapse.Panel key={index} header={ capitalize(group.name) }>
              <div>
                {renderGroupType(group.type, { ...layer }, group.properties)}
              </div>
            </AntDCollapse.Panel>
          })}

        </AntDCollapse>
      </div>
      

    </div>
  </>
}

export default LayerEditor;