'use client';
const Loader = (className) => {
    return (
        <div className="loader-wrapper">
            <div className="loader-inner">
                <div className="loader"></div>
                {/* <div className="loader-line-wrap">
                <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                <div className="loader-line"></div>
                </div> */}
            </div>
        </div>
    );
};

export default Loader;
