'use client';

import { useState, useEffect } from "react";

const usePageDimensions = () => {
    const [pageDimensions, setPageDimensions] = useState(() => ({
        height: window.pageYOffset,
    }));

    useEffect(() => {
        const handleScroll = () => {
            setPageDimensions({
                height: window.pageYOffset,
            });
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return pageDimensions;
}

export default usePageDimensions;
