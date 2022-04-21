import React from "react";
import ScrollContainer from "../common/ScrollContainer";
import '../../styles/_layout/map-editor-layout.scss';

interface MapEditorLayoutProp{
    toolbar:any;
    layerList: any;
    layerEditor: any;
    map:any;
    bottom:any;
    modals: any;
    onItemClick : (item:any) => void
}
const MapEditorLayout : React.FC<MapEditorLayoutProp> = (props)=>{
    return (
      <div className="maputnik-layout">
        <div className="maputnik-layout-toolbar">
          {props.toolbar}
        </div>
        
        <div className="maputnik-layout-body">
          <div className="maputnik-layout-list">
            {props.layerList}
          </div>

          <div className="maputnik-layout-drawer">
            <ScrollContainer>
              {props.layerEditor}
            </ScrollContainer>
          </div>

          <div className="maputnik-layout-map">
            {props.map}
          </div>

        </div>
        
        {props.bottom && <div className="maputnik-layout-bottom">
            {props.bottom}
          </div>
        }

        {props.modals}
      </div>
    );
}

export default MapEditorLayout;