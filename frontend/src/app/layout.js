'use client';

import '@/app/css/reset.scss';
import '@/app/css/general.scss';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import Script from 'next/script';
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
            <head>
                <title>CafeQRMenü - Masadan Sipariş!</title>
                <meta
                    name="description"
                    content="Kolay ve Hızlı Kare Kod Menü Oluşturma!"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href="/favicons/apple-icon-57x57.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="60x60"
                    href="/favicons/apple-icon-60x60.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="72x72"
                    href="/favicons/apple-icon-72x72.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="76x76"
                    href="/favicons/apple-icon-76x76.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="114x114"
                    href="/favicons/apple-icon-114x114.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href="/favicons/apple-icon-120x120.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="144x144"
                    href="/favicons/apple-icon-144x144.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/favicons/apple-icon-152x152.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicons/apple-icon-180x180.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/favicons/android-icon-192x192.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/favicons/favicon-96x96.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicons/favicon-16x16.png"
                />
                <link
                    rel="manifest"
                    href="/favicons/manifest.json"
                />
                <meta
                    name="msapplication-TileColor"
                    content="#ffffff"
                />
                <meta
                    name="msapplication-TileImage"
                    content="/favicons/ms-icon-144x144.png"
                />
                <meta
                    name="theme-color"
                    content="#ffffff"
                />
            </head>
            <Script
                id='gtag-base'
                strategy='afterInteractive'
                src='https://www.googletagmanager.com/gtag/js?id=AW-472856526'
            />
            <Script
                id='gtag-init'
                strategy='afterInteractive'
            >
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'AW-472856526');
                `}
            </Script>
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
                        </ProgressProvider>
                    </AuthProvider>
                </AppWrapper>
            </body>
        </html>
    );
}
