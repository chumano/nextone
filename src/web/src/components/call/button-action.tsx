import classnames from 'classnames';
const ButtonAction = (props:any)=>{
    return <>
        <div className={classnames('button-action clickable', props.className)}
         onClick={props.onClick}>
            {props.children}
        </div>
    </>
}

export default ButtonAction;