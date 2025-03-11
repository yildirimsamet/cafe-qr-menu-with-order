import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { socket } from '@/app/lib/socket';
import styles from './styles.module.scss';

const useNotificaion = () => {
    const playSound = () => {
        const audio = new Audio('/ding.mp3');

        audio.play();
    };

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        if (!socket.hasListeners('orders')) {
            socket.on('orders', (data) => {
                data !== 'update' &&
                    setTimeout(() => {
                        try {
                            playSound();

                            toast(<div className={styles.toastWrapper}>
                                <div className={styles.toastWrapperTitle}>
                                    <span>{data.table_name}</span> yeni sipariş.
                                </div>
                                {data.order_note &&
                                    <div className={styles.toastWrapperNote}>
                                        <span>Müşteri notu:</span> {data.order_note}
                                    </div>
                                }
                            </div>);
                        } catch (error) {

                        }
                    }, 250);
            });
        }

        return () => {
            if (socket.connected) {
                socket.off('orders');
                socket.disconnect();
            }
        };
    }, []);

    const notificationCallback = (callback) => {
        typeof callback === 'function' && callback();
    };

    return {
        socket,
        notificationCallback,
    };
};

export default useNotificaion;
