import MainHeader from "./MainHeader";
import '../../styles/_layout/main-layout.scss';
const MainLayout : React.FC = (props:any)=>{
    return <>
        <div className="main-layout-container">
            <div className="header-container">
                <MainHeader/>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    </>
}

export default MainLayout;