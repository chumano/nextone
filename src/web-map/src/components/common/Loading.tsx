import { Spin } from 'antd';

const styles = {
    display: "flex",
    justifyContent: "center"
};
const Loading :React.FC = ()=>{
    return <>
        <div style={styles} >
                <Spin />
        </div>
    </>;
}

export default Loading;