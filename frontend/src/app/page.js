'use client';

// import { useEffect } from 'react';
// import LoginForm from './components/Login';
// import { useAuth } from './hooks/useAuth';
// import useCustomRouter from './hooks/useCustomRouter';
import Landing from './components/Landing';

export default function Home () {
    // const { user } = useAuth();
    // const router = useCustomRouter();

    // useEffect(() => {
    //     if (user) {
    //         router.push('/tables');
    //     }
    // }, [user]);

    return (
        <div>
            {/* <LoginForm /> */}
            <Landing />
        </div>
    );
}
