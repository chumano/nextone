import { Component, Suspense } from "react";
import { RouteProps } from "react-router";
import Loading from "../../components/common/Loading";


const loading = () => <Loading />

const withLayout = <P extends object & RouteProps>(
  Layout:  React.ComponentType<any> , WrappedComppent: React.ComponentType<P>
)=>{
    return class extends Component<P>{
        render(){
            return<Suspense fallback={loading()}>
                <Layout {...this.props}>
                    <WrappedComppent {...this.props}/>
                </Layout>
            </Suspense>
            ;
        }
    }
};

export default withLayout;