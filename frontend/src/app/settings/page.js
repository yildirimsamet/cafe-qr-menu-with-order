'use client';

import ColorSettings from '../components/Settings/ColorSettings';
import ContactSettings from '../components/Settings/ContactSettings';
import LogoSettings from '../components/Settings/LogoSettings';
import { useAuthorization } from '../hooks/useAuthorization';

const Settings = () => {
    useAuthorization({ authorization: 'superadmin' });

    return (
        <div>
            <LogoSettings />
            <ColorSettings />
            <ContactSettings />
        </div>
    );

};

export default Settings;
