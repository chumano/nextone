
const ToolBar = (props:any)=>{
    return <>
        <div className="map-editor-toolbar">
            <h3>
                Maps/{props?.map?.Name}
            </h3>
        </div>
    </>
}

export default ToolBar;