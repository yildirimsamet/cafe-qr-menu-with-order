import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export function useAuthorization ({
    authorization = '',
    redirectUrl = '/',
}) {
    const { user } = useAuth();
    const router = useRouter();
    const roleHierarchy = ['guest', 'waiter', 'admin'];

    useEffect(() => {
        if (authorization && roleHierarchy.indexOf(user?.role) < roleHierarchy.indexOf(authorization)) {
            if (router.pathname !== redirectUrl) {
                router.push(redirectUrl);
            }
        }
    }, [user, authorization, redirectUrl]);

    return { user };
}

