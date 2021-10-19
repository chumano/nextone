import { Suspense } from "react";
import { RouteComponentProps } from "react-router";
import Loading from "../controls/loading/Loading";
import '../../styles/components/layout/noauth-layout.scss';

const loading = ()=> <Loading />;

interface IProp extends RouteComponentProps{
} 

const NoAuthLayout :React.FC<IProp> = (props):JSX.Element=>{
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