import { Component } from "react";
import { RouteComponentProps } from "react-router";


const withLayout = <P extends object & RouteComponentProps>(
    WrappedComppent: React.ComponentType<P>
)=>{
    return class extends Component<P>{
        render(){
            return <WrappedComppent {...this.props}/>;
        }
    }
};

export default withLayout;