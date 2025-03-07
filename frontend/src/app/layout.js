'use client';

import '@/app/css/reset.scss';
import '@/app/css/general.scss';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { AppWrapper } from '@/app/context/appContext';
import Loader from './components/Loader';
import NavBar from './components/Navbar';
import 'sweetalert2/src/sweetalert2.scss';
import { AuthProvider } from './context/authContext';

export default function RootLayout ({ children }) {
    return (
        <html lang="tr">
            <body>
                <AppWrapper>
                    <AuthProvider>
                        <ProgressProvider
                            height="4px"
                            color="#c55c1e"
                            options={{ showSpinner: false }}
                            shallowRouting
                        >
                            <Loader />
                            <div>
                                <NavBar />
                                {children}
                            </div>
                        </ProgressProvider>
                    </AuthProvider>
                </AppWrapper>
            </body>
        </html>
    );
}
