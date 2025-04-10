'use client';

import { useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { useAuth } from './useAuth';
import useCustomRouter from './useCustomRouter';

export function useAuthorization ({
    authorization = '',
    redirectUrl = '/login',
}) {
    const { user } = useAuth();
    const router = useCustomRouter();
    const roleHierarchy = ['guest', 'waiter', 'admin', 'superadmin'];
    const { state: { loading } } = useAppContext();

    let authCheckTimeOut;

    useEffect(() => {
        authCheckTimeOut = setTimeout(() => {
            if (!loading &&
                authorization &&
                roleHierarchy.indexOf(user?.role) < roleHierarchy.indexOf(authorization)) {
                if (router.pathname !== redirectUrl) {
                    router.push(redirectUrl);
                }
            }
        }, 500);

        return () => {
            clearTimeout(authCheckTimeOut);
        };
    }, [user, authorization, redirectUrl, loading]);

    return { user };
}

