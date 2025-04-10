'use client';

import '@/app/css/reset.scss';
import '@/app/css/general.scss';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { ToastContainer } from 'react-toastify';
import { AppWrapper } from '@/app/context/appContext';
import Loader from './components/Loader';
import NavBar from './components/Navbar';
import 'sweetalert2/src/sweetalert2.scss';
import { AuthProvider } from './context/authContext';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function RootLayout ({ children }) {
    return (
        <html lang="tr">
            <body suppressHydrationWarning>
                <AppWrapper>
                    <AuthProvider>
                        <ProgressProvider
                            height="4px"
                            color="#c55c1e"
                            options={{ showSpinner: false }}
                            shallowRouting
                        >
                            <Loader />
                            <NavBar />
                            {children}
                            <ToastContainer />
                        </ProgressProvider>
                    </AuthProvider>
                </AppWrapper>
            </body>
        </html>
    );
}
