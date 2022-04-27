import { Collapse } from "antd";
import { FieldId, FieldType, FieldSource,
    FieldMinZoom, FieldMaxZoom, FieldComment } from "../../components/fields";

const AntDCollapse :any = Collapse;


const renderGroupType = (type: string, props:any, fields:any) =>{
    let comment = ""
    const sourceLayerIds :any[]= [];
    if(!props.layer){
      props.layer = {
        id: 'id',
        name: 'name',
        type:'fill',
        source: 'source1'
      }
    }
    if(!props.sources){
      props.sources = {};
    }
    switch(type) {
      case 'layer': return <div>
        <FieldId
          value={props.layer.id}
          onChange={()=>{}}
        />
        <FieldType
          disabled={true}
          value={props.layer.type}
          onChange={()=>{}}
        />
        {props.layer.type !== 'background' 
        && <FieldSource
          sourceIds={Object.keys(props.sources)}
          value={props.layer.source}
          onChange={()=>{}}
        />
        }

        <FieldMinZoom
          value={props.layer.minzoom}
          onChange={()=>{}}
        />
        <FieldMaxZoom
          value={props.layer.maxzoom}
          onChange={()=>{}}
        />
        <FieldComment
          value={comment}
          onChange={()=>{}}
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
    const layerName ='sông';
    return <>
        <div className="layer-editor">
            <div className="layer-editor__header">
                <span> Layer: '{layerName}'</span>
            </div>
           
            <AntDCollapse
                defaultActiveKey={['1','2',]}
                onChange={(key:string|string[]) => { }}
                expandIconPosition={'right' as any}
            >
                <AntDCollapse.Panel header="Layer" key="1" >
                    <div>
                      {renderGroupType('layer',{id:'abc'},{})}
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