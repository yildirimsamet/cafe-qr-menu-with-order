'use client';

import EditCategories from '@/app/components/Edit/EditCategories';
import EditProducts from '@/app/components/Edit/EditProducts';
import EditSizes from '@/app/components/Edit/EditSizes';
import { useAuthorization } from '../hooks/useAuthorization';
import useNotification from '../hooks/useNotification';

const Edit = () => {
    useNotification();
    useAuthorization({ authorization: 'admin', redirectUrl: '/login' });

    return (
        <div>
            <EditCategories />
            <EditSizes />
            <EditProducts />
        </div>
    );
};

export default Edit;
