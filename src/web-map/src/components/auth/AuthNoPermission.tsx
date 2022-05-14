import { Button } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../../services/AuthenticationService";
import { authActions } from "../../stores/auth/authReducer";
import {PoweroffOutlined} from "@ant-design/icons"
import React from "react";

const containerStyle :React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    padding: "10px"
}
const AuthNoPermission : React.FC = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logOut = () => {
        dispatch(authActions.logout())
        navigate("/auth/redirect");
    }
    return <>
    <div style={containerStyle}>
        <div style={{width:'50%'}}> 
            <h1>No Permission</h1>
            <p>
                Bạn không có quyền. Vui lòng liên hệ người quản trị để được trợ giúp.
            </p>
            <Button type="primary" onClick={logOut}>
                <PoweroffOutlined style={{color:"#ff7875"}}/>Đăng xuất
            </Button>
        </div>
       
    </div>
      
    </>
}

export default AuthNoPermission;
