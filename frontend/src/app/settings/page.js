'use client';

import ColorSettings from '../components/Settings/ColorSettings';
import LogoSettings from '../components/Settings/LogoSettings';
import TextSettings from '../components/Settings/TextSettings';
import { useAuthorization } from '../hooks/useAuthorization';

const Settings = () => {
    useAuthorization({ authorization: 'superadmin' });

    return (
        <div>
            <LogoSettings />
            <ColorSettings />
            <TextSettings />
        </div>
    );

};

export default Settings;
