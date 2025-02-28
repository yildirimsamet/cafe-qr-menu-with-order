'use client';

import { usePathname } from 'next/navigation';
import { createContext, use, useContext, useEffect, useState } from 'react';
import axios from '@/app/lib/axios';

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
        setState((prev) => ({ ...prev, loading: true }));
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    // useCustomRouter set loading to true so we need to set it back to false for every page change
    setState((prev) => ({ ...prev, loading: false }));
  }, [pathname]);

  useEffect(() => {
    axios.get('/settings').then(({ data }) => {
      setState((prev) => ({ ...prev, settings: data.data }));
      return data.data;
    }).then((data) => {
      const colors = data?.colors || {};

      Object.keys(colors).forEach((key) => {
        document.documentElement.style.setProperty(`--${key}`, colors[key]);
      });
    });
  }, []);

  return (
      <AppContext.Provider value={{ state, setState }}>
          {children}
      </AppContext.Provider>
  );
}

export function useAppContext () {
  return useContext(AppContext);
}
