import {CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons';
const Collapser: React.FC<{style:any, isCollapsed: boolean}> = ({style, isCollapsed})=> {
    const iconStyle = {
        width: 20,
        height: 20,
        ...style,
    }
    
    return isCollapsed ?  <CaretUpOutlined style={iconStyle}/> :<CaretDownOutlined style={iconStyle}/>
}


  export default  Collapser;
