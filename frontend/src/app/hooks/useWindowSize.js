'use client';

import { debounce } from '@/app/utils';
import { useEffect, useState } from 'react';

export function useWindowSize () {
    const [windowSize, setWindowSize] = useState(() => ({
        width: window.innerWidth,
        isMobile: window.innerWidth < 1000,
    }));

    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowSize({
                width: window.innerWidth,
                isMobile: window.innerWidth < 1000,
            });
        }, 250);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

