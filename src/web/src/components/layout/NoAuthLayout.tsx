import { Suspense } from "react";
import { RouteComponentProps } from "react-router";
import Loading from "../controls/loading/Loading";

const loading = ()=> <Loading />;

interface IProp extends RouteComponentProps{
} 

const NoAuthLayout :React.FC<IProp> = (props):JSX.Element=>{

    return <>
        No AuthLayout page
        <Suspense fallback={loading()}>
            {props.children}
        </Suspense>
    </>;
}

export default NoAuthLayout;