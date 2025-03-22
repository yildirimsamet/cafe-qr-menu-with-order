'use client';

import { useEffect, useState } from 'react';
import axios from '@/app/lib/axios';
import SendOrders from '../components/SendOrders';
import WaitingOrders from '../components/WaitingOrders';
import { useAuthorization } from '../hooks/useAuthorization';
import useNotification from '../hooks/useNotification';
import styles from './styles.module.scss';
import Notifications from '../components/Notifications';

const Orders = () => {
    const { socket, notificationCallback, subscribeToOrders, unsubscribeFromOrders } = useNotification();
    useAuthorization({ authorization: 'waiter' });
    const [waitingOrders, setWaitingOrders] = useState([]);
    const [sendOrders, setSendOrders] = useState([]);

    const getOrders = async () => {
        try {
            const { data } = await axios.get('/orders');

            setWaitingOrders(data.data.waiting.reverse());
            setSendOrders(data.data.send.reverse());
        } catch (error) {
            //
        }
    };


    useEffect(() => {
        subscribeToOrders(getOrders);

        return () => {
            unsubscribeFromOrders(getOrders);
        };
    }, [])

    let getOrdersInterval;

    useEffect(() => {
        getOrders();

        getOrdersInterval = setInterval(() => {
            getOrders();
        }, 10000);

        return () => {
            clearInterval(getOrdersInterval);
        };
    }, []);

    const orderGroupStatusChange = async () => {
        notificationCallback(() => {
            socket.emit('order', 'update');
        });
    };

    return (
        <div className={styles.orders}>
            <div className={styles.ordersContent}>
                <WaitingOrders
                    waitingOrders={waitingOrders}
                    callback={() => {
                        orderGroupStatusChange();
                        getOrders();
                    }}
                />
                <SendOrders
                    sendOrders={sendOrders}
                    callback={() => {
                        orderGroupStatusChange();
                        getOrders();
                    }}
                />
            </div>
            <div className={styles.ordersNotifications}>
                <Notifications />
            </div>
        </div>
    );
};

export default Orders;
