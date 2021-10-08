import { type } from 'os';
import { useEffect, useState } from 'react';
import '../../styles/components/pagination/pagination.scss';
import BreakView from './BreakView';
import PageView from './PageView';

interface IProp {
    type?: 'simple' | 'advanced',
    onPageChange?: (page: number) => void,
    showGoto?:boolean,

    initialPage?: number,
    totalPage?: number,
    numberPageDisplayed?: number,
    numberMarginPagesDisplayed?: number,

    previousLabel? : string,
    nextLabel? : string,
    breakLabel? : string,

    containerClassName?: string,
    pageClassName?: string,
    activeClassName?: string,
    breakClassName?: string
}



const Pagination: React.FC<IProp> = ({
    type,
    onPageChange,
    showGoto,

    initialPage,
    totalPage,
    numberPageDisplayed,
    numberMarginPagesDisplayed,

    previousLabel,
    nextLabel,
    breakLabel,

    containerClassName,

    pageClassName,
    activeClassName,
    breakClassName
}) => {
    const [currentPage, setCurrentPage] = useState<number>(initialPage || 1);
    const disabledClassName = 'disabled';
    const pagecount = totalPage || 0;
    const previousClasses = 'previous' + (currentPage === 1 ? ` ${disabledClassName}` : '');
    const nextClasses = 'next' + (currentPage >= pagecount ? ` ${disabledClassName}` : '');

    useEffect(() => {
        let selectedPage = 1;
        if (initialPage != undefined) {
            selectedPage = initialPage;
        }

        setCurrentPage(selectedPage);
        if (onPageChange) {
            onPageChange(selectedPage);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        if (onPageChange) {
            onPageChange(1);
        }
    }, [totalPage]);

    const onHandlePreviousPage = (evt: any) => {
        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
        if (currentPage > 1) {
            onHandlePageSelected(currentPage - 1, evt);
        }
    }

    const onHandleNextPage = (evt: any) => {
        const pageCount = totalPage || 0;

        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
        if (currentPage < pageCount) {
            onHandlePageSelected(currentPage + 1, evt);
        }
    }

    const onHandlePageSelected = (page: number, evt: any) => {
        setCurrentPage(page);
        if (onPageChange) {
            onPageChange(page);
        }
    }

    const onHandleBreakClick = (page: number,evt:any) => {
        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
        onHandlePageSelected(
          currentPage < page ? getForwardJump() : getBackwardJump(),
          evt
        );
    }

    const getForwardJump = () => {
        const pageRangeDisplayed = numberPageDisplayed || 0;
        const pageCount = totalPage || 0;

        const forwardJump = currentPage + pageRangeDisplayed;
        return forwardJump >= pageCount ? pageCount - 1 : forwardJump;
    }

    const getBackwardJump = () => {
        const pageRangeDisplayed = numberPageDisplayed || 0;
        const pageCount = totalPage || 0;

        const backwardJump = currentPage - pageRangeDisplayed;
        return backwardJump < 0 ? 0 : backwardJump;
    }

    const pagination = () => {
        const items = [];
        const pageCount = totalPage || 0;
        const pageRangeDisplayed: number = numberPageDisplayed || 0;
        const marginPagesDisplayed: number = numberMarginPagesDisplayed || 0;
        if (pageCount <= pageRangeDisplayed) {
            for (let page = 0; page <= pageCount; page++) {
                items.push(getPageElement(page));
            }
        } else {
            let leftSide = pageRangeDisplayed / 2;
            let rightSide = pageRangeDisplayed - leftSide;


            if (currentPage > pageCount - pageRangeDisplayed / 2) {
                rightSide = pageCount - currentPage;
                leftSide = pageRangeDisplayed - rightSide;
            } else if (currentPage < pageRangeDisplayed / 2) {
                leftSide = currentPage;
                rightSide = pageRangeDisplayed - leftSide;
            }

            let index;
            let page;
            let breakView;
            let createPageView = (page: number) => getPageElement(page);

            for (index = 0; index < pageCount; index++) {
                page = index + 1;


                if (page <= marginPagesDisplayed) {
                    items.push(createPageView(page));
                    continue;
                }


                if (page > pageCount - marginPagesDisplayed) {
                    items.push(createPageView(page));
                    continue;
                }


                if (page >= currentPage - leftSide && page <= currentPage + rightSide) {
                    items.push(createPageView(page));
                    continue;
                }


                if (breakLabel && items[items.length - 1] !== breakView) {
                    const hanlder = onHandleBreakClick.bind(null,page);
                    breakView = (
                        <BreakView
                            key={page}
                            breakLabel={breakLabel}
                            breakClassName={breakClassName}
                            breakHandler={hanlder}
                        />
                    );
                    items.push(breakView);
                }
            }
        }

        return items;
    };

    const getPageElement = (page: number) => {
        return (
            <PageView
                key={page}
                pageSelectedHandler={onHandlePageSelected.bind(null, page)}
                selected={currentPage === page}
                pageClassName={pageClassName}
                activeClassName={activeClassName}
                href={'#'}
                page={page}
            />
        );
    }

    const gotoPage = (page:number) =>{
        onHandlePageSelected(page, null);
    }

    return <>
        <div className="pagination">
            {showGoto && (totalPage||0) >0 &&
                <span className="pagination__goto">
                <input
                    type="number"
                    value={currentPage}
                    min={1}
                    max={totalPage}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value): 1;
                        if(page <1 || page > (totalPage||0)) return;
                        gotoPage(page)
                    }}
                />
                <span className="total-page">/{totalPage}</span>
                </span>
            }
            <ul className={containerClassName}>
                <li className={previousClasses}>
                    <a
                        href={'#'}
                        tabIndex={0}
                        role="button"
                        onClick={onHandlePreviousPage}
                        aria-label={'previous'}
                        rel={'prev'}
                    >
                        {previousLabel}
                    </a>
                </li>

                {type=='advanced' && pagination()}

                <li className={nextClasses}>
                    <a
                        href={'#'}
                        tabIndex={0}
                        role="button"
                        onClick={onHandleNextPage}
                        aria-label={'next'}
                        rel={'next'}
                    >
                        {nextLabel}
                    </a>
                </li>
            </ul>
        </div>
    </>
}


Pagination.defaultProps = {
    type: 'simple',
    showGoto: true,
    
    numberPageDisplayed: 2,
    numberMarginPagesDisplayed: 3,
    activeClassName: 'selected',
    previousLabel : "Trước",
    nextLabel : "Sau",
    breakLabel : '...',

};
export default Pagination;