'use client';

import Orders from '@/app/components/Orders';
import ProductsSellCount from '@/app/components/ProductsSellCount';
import TableOrderCount from '@/app/components/TableOrderCount';
import { useAuthorization } from '../hooks/useAuthorization';
import styles from './styles.module.scss';

const Statistics = () => {
    useAuthorization({
        authorization: 'superadmin',
        redirectUrl: '/tables',
    });

    return (
        <div className={styles.statistics}>
            <h1 className={styles.statisticsTitle}>Satılan Ürün Sayısı</h1>
            <ProductsSellCount />
            <h1 className={styles.statisticsTitle}>Masa Sipariş Sayısı</h1>
            <TableOrderCount />
            <h1 className={styles.statisticsTitle}>Masa Sipariş Geçmişi</h1>
            <Orders />
        </div>
    );
};

export default Statistics;