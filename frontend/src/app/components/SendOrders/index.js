'use client';

import classNames from 'classnames';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import axios from '@/app/lib/axios';
import styles from './styles.module.scss';
import 'moment/locale/tr';

const SendOrders = ({ sendOrders, callback }) => {
    const { state : { settings }} = useAppContext();
    const openPopup = (orderGroupId) => {
        Swal.fire({
            title: '"Bekleyen siparişlere almak istediginizden emin misiniz?"',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.put(`/orders/order_groups/${orderGroupId}/status`, {
                        status: 'waiting',
                    }).then(() => {
                        callback();
                    });
                } catch (error) {
                    //
                }
            }
        });
    };
    return (
        <div
            className={styles.sendOrders}
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <div className={styles.sendOrdersTitle}>Gönderilen Siparişler</div>
            {
                sendOrders.length > 0 ? (<div className={classNames(styles.sendOrdersList, 'container')}>
                    {sendOrders?.map((order_group, index) => {
                        return (
                            <div
                                onClick={() => {
                                openPopup(order_group.order_group_id);
                            }}
                                key={index}
                                className={styles.sendOrdersListItem}
                            >
                                <div className={styles.sendOrdersListItemTitle}>
                                    Masa Adı: {order_group.tableName}
                                </div>
                                <div className={styles.sendOrdersListItemDate}>
                                    {moment(order_group.created_at).locale('tr').fromNow()}
                                </div>
                                <div className={styles.sendOrdersListItemItemsWrapper}>
                                    {order_group.items?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={styles.sendOrdersListItemItemsWrapperItem}
                                        >
                                            <div>
                                                <img
                                                    src={`${
                                                        process.env.NEXT_PUBLIC_API_URL}/assets/images/${
                                                            item.item_image || settings?.logo
                                                        }`
                                                    }
                                                    alt={item.item_name}
                                                />
                                                {item.item_name}
                                            </div>
                                            <div>{item.item_quantity}</div>
                                            <div>{item.item_size}</div>
                                        </div>
                                    );
                                })}
                                </div>
                                <div className={styles.sendOrdersListItemInfo}>
                                    {order_group.order_group_note && <div className={styles.sendOrdersListItemInfoNote}>
                                        <span>Müşteri Notu:</span> <span>{order_group.order_group_note}</span>
                                    </div>}
                                    <div className={styles.sendOrdersListItemInfoUpdatedBy}>
                                        <span>Güncelleyen:</span> <span>{order_group.updatedBy || 'Yok'}</span>
                                    </div>
                                    <div className={styles.sendOrdersListItemInfoStatus}>Gönderildi</div>
                                </div>
                            </div>
                        );
                    })}
                </div>) : (
                    <div className={styles.sendOrdersEmpty}>
                        Gönderilen sipariş bulunmamaktadır.
                    </div>
                )
            }
        </div>
    );
};

export default SendOrders;
