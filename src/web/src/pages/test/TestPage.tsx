import React from 'react'
import '../../styles/pages/test-page/test-page.scss';

const TestPage: React.FC = () => {
    return <>
        <div className="test-page">
            <div>
                <span className="page-title">Test pages</span>
            </div>

            {/* Placeholder */}
            <div className="test-page__component">
                <div className="component-title">
                    Placeholder
                </div>
                <div className="card" aria-hidden="true">
                    <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                        <title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect>
                    </svg>
                    <div className="card-body">
                        <h5 className="card-title placeholder-glow">
                            <span className="placeholder col-6"></span>
                        </h5>
                        <p className="card-text placeholder-glow">
                            <span className="placeholder col-7"></span>
                            <span className="placeholder col-4"></span>
                            <span className="placeholder col-4"></span>
                            <span className="placeholder col-6"></span>
                            <span className="placeholder col-8"></span>
                        </p>
                        <a href="#" tabIndex={-1} className="btn btn-primary disabled placeholder col-6"></a>
                    </div>
                </div>
            </div>

            {/* Other */}
            <div className="test-page__component">
                <div className="component-title">
                    Other
                </div>
            </div>
        </div>
    </>;
}

export default TestPage;
