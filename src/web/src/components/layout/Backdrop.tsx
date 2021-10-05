import '../../styles/components/layout/backdrop.scss'

interface IProp{
    backdropClick: ()=> void;
}
const Backdrop : React.FC<IProp> = ({backdropClick})=>{
    return <>
    <div className="backdrop" onClick={backdropClick}></div>
    </>;
}

export default Backdrop;
