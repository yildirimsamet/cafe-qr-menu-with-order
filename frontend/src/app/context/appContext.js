'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export function AppWrapper ({ children }) {
    const pathname = usePathname();
    const [state, setState] = useState({
        basket: [],
        listItems: [],
        tableSlug: '',
        loading: true,
    });

    useEffect(() => {
        const handleClick = (event) => {
          let target = event.target;
          while (target && !target.href) target = target.parentElement;
          if (target && target.href) {
            setState({...state, loading: true});
          }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
      }, []);

      useEffect(() => {
        // useCustomRouter set loading to true so we need to set it back to false for every page change
        setState({...state, loading: false});
      }, [pathname]);

    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext () {
    return useContext(AppContext);
}
