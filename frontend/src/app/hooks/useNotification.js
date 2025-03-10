import { useEffect } from 'react';
import { socket } from '@/app/lib/socket';

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
