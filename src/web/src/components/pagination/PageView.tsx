
interface IProp {
    page: number
    selected: boolean,

    pageSelectedHandler: (evt:any, index:number) => void,

    pageClassName?:string,
    pageLinkClassName?:string,
    activeClassName?: string,
    activeLinkClassName?: string,
    href?: string,

}

const PageView: React.FC<IProp> = ({
    page,
    selected,

    pageSelectedHandler,

    pageClassName,
    pageLinkClassName,
    activeClassName,
    activeLinkClassName,
    href,
}) => {

    const getPageClassName = ()=>{
        let classNames ="";
        if (typeof pageClassName !== 'undefined') {
            classNames = pageClassName + ' ' + (selected?activeClassName:'');
          } else {
            classNames = (selected?activeClassName:'') || '';
          }
        return classNames;
    }

    const getPageLinkClassName = ()=>{
        let classNames ="";
        if (typeof pageLinkClassName !== 'undefined') {
            classNames = pageLinkClassName + ' '+ (selected? activeLinkClassName:'');
          } else {
            classNames = (selected? activeLinkClassName:'') ||'';
          }
        return classNames;
    }

    const pageLabelBuilder = (page:number)=>{
        return ''+page;
    }
    
    return <>
        <li className={getPageClassName()} 
            onClick={(evt:any)=> { pageSelectedHandler(evt,page) }} >
            <a
                role="button"
                className={getPageLinkClassName()}
                href={href}
                tabIndex={0}
                aria-label={'ariaLabel'}
                aria-current={'page'}
            >
                {pageLabelBuilder(page)}
            </a>
        </li>
    </>;
}

export default PageView;