'use client';

import ColorSettings from '../components/Settings/ColorSettings';
import ContactSettings from '../components/Settings/ContactSettings';
import LogoSettings from '../components/Settings/LogoSettings';
import { useAuthorization } from '../hooks/useAuthorization';
import useNotification from '../hooks/useNotification';

const Settings = () => {
    useNotification();
    useAuthorization({ authorization: 'superadmin', redirectUrl: '/login' });

    return (
        <div>
            <LogoSettings />
            <ColorSettings />
            <ContactSettings />
        </div>
    );

};

export default Settings;
