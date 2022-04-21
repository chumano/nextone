import { Link } from "react-router-dom";

const MainHeader : React.FC = (props:any)=>{
    return <>
        <div className="main-header">
            <nav style={{ }}>
                <Link to="/">Home</Link>
                |{" "}
                <Link to="/maps">Maps</Link>
                |{" "}
                <Link to="/maps/new">Map Editor</Link>
            </nav>
        </div>
    </>
}

export default MainHeader;