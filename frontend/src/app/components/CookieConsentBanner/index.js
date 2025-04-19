'use client';

import React from 'react';
import { CookieConsent } from 'react-cookie-consent';
import styles from './styles.module.scss';

const CookieConsentBanner = () => {
    const handleAcceptCookie = () => {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                analytics_storage: 'granted',
            });
            console.log('Cookie consent accepted and gtag updated.');
        } else {
            console.warn('gtag function not found. Make sure GTM is loaded.');
        }
    };

    const handleDeclineCookie = () => {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                analytics_storage: 'denied',
            });
            console.log('Cookie consent declined and gtag updated.');
        } else {
            console.warn('gtag function not found. Make sure GTM is loaded.');
        }
    };

    return (
        <CookieConsent
            location="bottom"
            buttonText="Kabul Et"
            declineButtonText="Reddet"
            cookieName="cafeQrMenuCookieConsent"
            containerClasses={styles.cookieConsentContainer}
            contentClasses={styles.content}
            buttonWrapperClasses={styles.buttonWrapper}
            buttonClasses={styles.button}
            declineButtonClasses={styles.declineButton}
            expires={365}
            enableDeclineButton
            onAccept={handleAcceptCookie}
            onDecline={handleDeclineCookie}
            // debug={true}
        >
            Sitemizi gezerken en iyi deneyimi yaşaman için çerezleri kullanıyoruz.
        </CookieConsent>
    );
};

export default CookieConsentBanner;
