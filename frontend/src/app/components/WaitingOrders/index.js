'use client';

import classNames from 'classnames';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import { useAuth } from '@/app/hooks/useAuth';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from '@/app/lib/axios';
import styles from './styles.module.scss';
import 'moment/locale/tr';

const WaitingOrders = ({ waitingOrders, callback }) => {
    const { user } = useAuth();
    const { state : { settings }} = useAppContext();
    const openPopup = (orderGroupId) => {
        Swal.fire({
            title: 'Gönderilen siparişlere almak istediginizden emin misiniz?',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .put(`/orders/order_groups/${orderGroupId}/status`, {
                        status: 'send',
                        updatedBy: user?.username,
                    })
                    .then(() => {
                        callback();
                    });
            }
        });
    };

    const handleCancelOrder = (orderGroupId) => {
        Swal.fire({
            title: 'Sipariş iptal edilecek emin misiniz?',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/orders/order_groups/${orderGroupId}`)
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
                <div className={classNames(styles.waitingOrdersList, 'container')}>
                    {waitingOrders?.map((order_group, index) => {
                        return (
                            <div
                                onClick={() => {
                                    openPopup(order_group.order_group_id);
                                }}
                                key={index}
                                className={styles.waitingOrdersListItem}
                            >
                                <div
                                    className={styles.waitingOrdersListItemDelete}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelOrder(order_group.order_group_id);
                                    }}
                                >
                                    <DeleteForeverIcon />
                                </div>
                                <div className={styles.waitingOrdersListItemTitle}>
                                    Masa Adı: {order_group.tableName}
                                </div>
                                <div className={styles.waitingOrdersListItemDate}>
                                    {moment(order_group.created_at).locale('tr').fromNow()}
                                </div>
                                <div className={styles.waitingOrdersListItemItemsWrapper}>
                                    {order_group.items?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={styles.waitingOrdersListItemItemsWrapperItem}
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
                                <div className={styles.waitingOrdersListItemInfo}>
                                    {order_group.order_group_note &&
                                    <div className={styles.waitingOrdersListItemInfoNote}>
                                        <span>Müşteri Notu:</span> <span>{order_group.order_group_note}</span>
                                    </div>}
                                    <div className={styles.waitingOrdersListItemInfoUpdatedBy}>
                                        <span>Güncelleyen:</span> <span>{order_group.updatedBy || 'Yok'}</span>
                                    </div>
                                    <div className={styles.waitingOrdersListItemInfoStatus}>
                                        Bekliyor
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.waitingOrdersEmpty}>Bekleyen sipariş bulunmamaktadır.</div>
            )}
        </div>
    );
};

export default WaitingOrders;
