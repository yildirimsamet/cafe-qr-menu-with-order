import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { socket } from '@/app/lib/socket';
import styles from './styles.module.scss';
import useSWR from 'swr';
import axios from '@/app/lib/axios';

const orderCallbacks = new Set(); // Order event'lerini dinleyen callback listesi

const useNotification = () => {
    const { data: notifications = [], mutate } = useSWR('notifications', () =>
        axios.get('/notifications').then(res => res.data.data).catch(error => [])
    );

    const deleteNotification = async (id) => {
        await axios.delete(`/notifications/${id}`);
        mutate();
    };

    const playSound = () => {
        const audio = new Audio('/ding.mp3');
        audio.volume = 1;
        audio.play();
    };

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        if (!socket.hasListeners('orders')) {
            socket.on('orders', (data) => {
                if (data !== 'update') {
                    setTimeout(() => {
                        try {
                            playSound();
                            toast(
                                <div className={styles.toastWrapper}>
                                    <div className={styles.toastWrapperTitle}>
                                        <span>{data.table_name}</span> yeni sipariş.
                                    </div>
                                    {data.order_note && (
                                        <div className={styles.toastWrapperNote}>
                                            <span>Müşteri notu:</span> {data.order_note}
                                        </div>
                                    )}
                                </div>
                            );

                            orderCallbacks.forEach((callback) => callback(data));
                        } catch (error) {
                            console.error('Order callback error:', error);
                        }
                    }, 250);
                }
            });
        }

        if (!socket.hasListeners('notifications')) {
            socket.on('notifications', (data) => {
                mutate();

                toast(
                    <div className={styles.toastWrapper}>
                        <div className={styles.toastWrapperTitle}>
                            <span>{data.table_name}</span> yeni mesaj.
                        </div>
                        {data.message && (
                            <div className={styles.toastWrapperNote}>
                                <span>Müşteri mesajı:</span> {data.message}
                            </div>
                        )}
                        {data.type === 'call_waiter' && (
                            <div className={styles.toastWrapperNote}>
                                <span>Garson çağırıyor.</span>
                            </div>
                        )}
                        {data.type === 'call_cashier' && (
                            <div className={styles.toastWrapperNote}>
                                <span>Hesap istiyor.</span>
                            </div>
                        )}
                    </div>
                );

                playSound();
            });
        }

        return () => {
            if (socket.connected) {
                socket.off('orders');
                socket.off('notifications');
                socket.disconnect();
            }
        };
    }, []);

    const subscribeToOrders = (callback) => {
        if (typeof callback === 'function') {
            orderCallbacks.add(callback);
        }
    };

    const unsubscribeFromOrders = (callback) => {
        if (typeof callback === 'function') {
            orderCallbacks.delete(callback);
        }
    };

    const notificationCallback = (callback) => {
        if (typeof callback === 'function') {
            callback();
        }
    };

    return {
        socket,
        notifications,
        deleteNotification,
        subscribeToOrders,
        unsubscribeFromOrders,
        notificationCallback
    };
};

export default useNotification;
