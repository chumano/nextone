import { Button } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authActions } from "../../store";

const NotAuthenticated : React.FC = () =>{
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        
    }, [])

    return <>
         <div style={{padding:50, textAlign: 'center'}}>
            <h1>Bạn không có quyền</h1>

            <Button onClick={()=>{
                 dispatch(authActions.logout)
                 history.push("/auth/redirect");

            }}>Đăng xuất</Button>
        </div>
    </>;
}

export default NotAuthenticated;