import { Suspense } from "react";
import Loading from "../common/Loading";

const loading = ()=> <Loading />;


const NoAuthLayout :React.FC<any> = (props)=>{
    return <>
        <div className="noauth-layout">
            <Suspense fallback={loading()}>
                <div className="noauth-layout__container">
                    {props.children}
                </div>  
            </Suspense>
        </div>
    </>;
}

export default NoAuthLayout;