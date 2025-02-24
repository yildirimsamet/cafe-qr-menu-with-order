'use client';

import moment from 'moment';
import Swal from 'sweetalert2';
import axios from '@/app/lib/axios';
import styles from './styles.module.scss';
import 'moment/locale/tr';

const WaitingOrders = ({ waitingOrders, callback }) => {
    const openPopup = (orderGroupId) => {
        Swal.fire({
            title:
        'Siparişi gönderilen siparişlere almak istediginizden emin misiniz?',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .put(`/orders/order_groups/${orderGroupId}/status`, {
                        status: 'send',
                    })
                    .then(() => {
                        callback();
                    });
            }
        });
    };
    return (
        <div className={styles.waitingOrders}>
            <div className={styles.waitingOrdersTitle}>Bekleyen Siparişler</div>
            {waitingOrders.length > 0 ? (
                <div className={styles.waitingOrdersList}>
                    {waitingOrders?.map((order_group, index) => {
                        return (
                            <div
                                onClick={() => {
                                    openPopup(order_group.order_group_id);
                                }}
                                key={index}
                                className={styles.waitingOrdersListItem}
                            >
                                <div className={styles.waitingOrdersListItemTitle}>
                                    Masa Adı: {order_group.tableName}
                                </div>
                                <div className={styles.waitingOrdersListItemDate}>
                                    {moment(order_group.created_at).locale('tr').fromNow()}
                                </div>
                                {order_group.items?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={styles.waitingOrdersListItemItem}
                                        >
                                            <div>{item.item_name} </div>
                                            <div>{item.item_quantity}</div>
                                            <div>{item.item_size}</div>
                                        </div>
                                    );
                                })}
                                <div className={styles.waitingOrdersListItemWaiter}>
                                    <span>Son güncelleyen:</span> <span>{order_group.waiterName || 'Yok'}</span>
                                </div>
                                <div className={styles.waitingOrdersListItemStatus}>
                                    Bekliyor
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.waitingOrdersEmpty}>Bekleyen Sipariş Yok</div>
            )}
        </div>
    );
};

export default WaitingOrders;
