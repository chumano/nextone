import { Spinner } from "reactstrap";

const styles = {
    marginLeft: "auto"
};
const Loading :React.FC = ():JSX.Element=>{

    return <>
        <div style={styles}>
            <Spinner type="grow" color="primary" style={{width: "3rem", height:"3rem"}}></Spinner>
        </div>
    </>;
}

export default Loading;