import { Spinner } from "reactstrap";

const styles = {
    display: "flex",
    justifyContent: "center"
};
const Loading :React.FC = ():JSX.Element=>{

    return <>
        <div style={styles}>
            <Spinner  color="primary" style={{width: "3rem", height:"3rem"}} children={''}/>
        </div>
    </>;
}

export default Loading;