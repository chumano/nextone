import { Redirect, useHistory } from "react-router-dom";
import Loading from "../../components/controls/loading/Loading";
import { useEffect } from "react";


const TermsPage: React.FC = (): JSX.Element => {
    const history = useHistory();
    useEffect(()=>{
        window.location.href ="/dieukhoan.html"
    },[])
    return  <Loading/>
}

export default TermsPage;