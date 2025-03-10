'use client';

import EditCategories from '@/app/components/Edit/EditCategories';
import EditProducts from '@/app/components/Edit/EditProducts';
import EditSizes from '@/app/components/Edit/EditSizes';
import { useAuthorization } from '../hooks/useAuthorization';
import useNotificaion from '../hooks/useNotification';

const Edit = () => {
    useNotificaion();
    useAuthorization({ authorization: 'admin' });

    return (
        <div>
            <EditCategories />
            <EditSizes />
            <EditProducts />
        </div>
    );
};

export default Edit;
