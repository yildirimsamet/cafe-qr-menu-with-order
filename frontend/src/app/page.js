'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from './components/Login';
import RegisterForm from './components/Register';
import { useAuth } from './hooks/useAuth';

export default function Home () {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/tables');
        }
    }, [user]);

    return (
        <div>
            <LoginForm />
        </div>
    );
}
