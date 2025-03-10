'use client';

import { usePathname } from 'next/navigation';
import { createContext, use, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from '@/app/lib/axios';

const AppContext = createContext();

export function AppWrapper ({ children }) {
  const pathname = usePathname();
  const [state, setState] = useState({
    basket: [],
    listItems: [],
    tableSlug: '',
    loading: true,
    settings: null,
  });

  const { data: globalSettings = {}, mutate } = useSWR('/settings', async (url) => {
    let settings = {};

    try {
    settings = await axios.get(url).then((res) => res.data.data);

    setState((prev) => ({ ...prev, settings }));

    localStorage.setItem('settings', JSON.stringify(settings));

    return settings;
    } catch (error) {
      //
    }

  });

  const reFetchSettings = () => {
    mutate();
  };

  useEffect(() => {
    const handleClick = (event) => {
      let target = event.target;
      while (target && !target.href) target = target.parentElement;
      if (target && target.href && target.target !== '_blank') {
        setState((prev) => ({ ...prev, loading: true }));
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    // useCustomRouter set loading to true so we need to set it back to false for every page change
    setTimeout(() => {
      setState((prev) => ({ ...prev, loading: false }));
    }, 100);
  }, [pathname]);

  useEffect(() => {
    if (Object.keys(globalSettings).length > 0) {
      setState((prev) => ({ ...prev, settings: globalSettings }));

      localStorage.setItem('settings', JSON.stringify(globalSettings));

      const colorSettings = globalSettings.colors;

      Object.keys(colorSettings).forEach((key) => {
        document.documentElement.style.setProperty(`--${key}`, colorSettings[key]);
      });
    }
  }, [globalSettings]);

  if (!state.settings) {
    return <div></div>;
  }

  return (
      <AppContext.Provider value={{ state, setState, reFetchSettings }}>
          {children}
      </AppContext.Provider>
  );
}

export function useAppContext () {
  return useContext(AppContext);
}
