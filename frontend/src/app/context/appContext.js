'use client';

import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper ({ children }) {
    const [state, setState] = useState({
        basket: [],
        listItems: [],
        tableSlug: '',
        loading: false,
    });

    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext () {
    return useContext(AppContext);
}
