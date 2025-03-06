'use client';

import { useEffect, useState } from 'react';
import axios from '@/app/lib/axios';
import { socket } from '@/app/lib/socket';
import SendOrders from '../components/SendOrders';
import WaitingOrders from '../components/WaitingOrders';
import { useAuthorization } from '../hooks/useAuthorization';
import styles from './styles.module.scss';

const Orders = () => {
    useAuthorization({ authorization: 'waiter' });
    const [waitingOrders, setWaitingOrders] = useState([]);
    const [sendOrders, setSendOrders] = useState([]);

    const playSound = () => {
        const audio = new Audio('/ding.mp3');

        audio.play();
    };

    const getOrders = async () => {
        try {
            const { data } = await axios.get('/orders');

            setWaitingOrders(data.data.waiting.reverse());
            setSendOrders(data.data.send.reverse());
        } catch (error) {
        //
        }
    };

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

    const orderGroupStatusChange = async (id, status) => {
        socket.emit('order', 'update');
    };

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        if (!socket.hasListeners('orders')) {
            socket.on('orders', (data) => {
                playSound();
                setTimeout(() => {
                    playSound();
                }, 175);
                getOrders();
            });
        }

        return () => {
            if (socket.connected) {
                socket.off('orders');
                socket.disconnect();
            }
        };
    }, []);

    return (
        <div className={styles.orders}>
            <WaitingOrders waitingOrders={waitingOrders} callback={() => {
                orderGroupStatusChange();
                getOrders();
            }}
            />
            <SendOrders sendOrders={sendOrders} callback={() => {
                orderGroupStatusChange();
                getOrders();
            }}
            />
        </div>
    );
};

export default Orders;
