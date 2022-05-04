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
      <div className="map-editor-layout">
        <div className="map-editor-layout-toolbar">
          {props.toolbar}
        </div>
        
        <div className="map-editor-layout-body">
          <div className="map-editor-layout-list">
            {props.layerList}
          </div>

          <div className="map-editor-layout-drawer">
            {/* <ScrollContainer> */}
              {props.layerEditor}
            {/* </ScrollContainer> */}
          </div>

          <div className="map-editor-layout-map">
            {props.map}
          </div>

        </div>
        
        {props.bottom && <div className="map-editor-layout-bottom">
            {props.bottom}
          </div>
        }

        {props.modals}
      </div>
    );
}

export default MapEditorLayout;