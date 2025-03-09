'use client';

import Cookies from 'js-cookie';
import { useState, createContext, useEffect } from 'react';
import axios from '@/app/lib/axios';
import useCustomRouter from '../hooks/useCustomRouter';
import { useAppContext } from './appContext';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { setState } = useAppContext();
    const [user, setUser] = useState(null);
    const router = useCustomRouter();

    const login = async ({ username, password }, navigate) => {
        setState((prev) => ({ ...prev, loading: true }));
        await axios.post('/auth/login', { username, password })
            .then(async ({ data }) => {
                if (data.status === 200) {
                    Cookies.set('token', data.data.token);
                    setUser(data.data.user);

                    if (navigate) {
                        router.push(navigate);
                    }

                }
            }).catch(error => {
                console.error(error);
            }).finally(async () => {
                setState((prev) => ({ ...prev, loading: false }));
            });
    };

    const register = ({ username, password, role }) => {
        axios.post('/auth/register', { username, password, role })
            .then(response => {
                if (response.status === 200) {
                    // Cookies.set('token', response.data.token);
                    // setUser(response.data.data);
                }
            }).catch(error => {
                console.error(error);
            });
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
    };

    const checkUser = async (cb) => {
        const token = Cookies.get('token');

        if (!user && token) {
            setState((prev) => ({ ...prev, loading: true }));
            const { data } = await axios.post('/auth/user', { token }).catch(error => {
                console.error(error);
                logout();
            });

            if (data.status === 200) {
                setUser(data.data);
            }
        }

        cb();
    };

    useEffect(() => {
        checkUser(() => {
            setState((prev) => ({ ...prev, loading: false }));
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
