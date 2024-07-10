import React from 'react';

const Loading = () => {
    
    return (
        <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center  bg-opacity-50">
            <div className="w-8 h-8 bg-primary rounded-md  animate-spin"></div>
        </div>
    );
};

export default Loading;