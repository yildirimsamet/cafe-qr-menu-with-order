'use client';

import CloseIcon from '@mui/icons-material/Close';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import { socket } from '@/app/lib/socket';
import { formatPrice } from '@/app/utils';
import BasketItem from './BasketItem';
import styles from './styles.module.scss';
import { GiReceiveMoney } from "react-icons/gi";
import { PiBasketDuotone } from "react-icons/pi";
import { MdOutlineMessage } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";

const Basket = ({ tableInfo }) => {
    const { state, setState } = useAppContext();
    const [isBasketOpened, setIsBasketOpened] = useState(false);
    const [orderNote, setOrderNote] = useState('');
    const isBasketEmpty = state.basket.length <= 0;
    const [totalPrice, setTotalPrice] = useState(0);
    
    useEffect(() => {
        setTotalPrice(formatPrice(state.basket
            .reduce((acc, item) => acc + item.quantity * item.price, 0)));
    }, [state]);

    const sendOrderToSocket = () => {
        socket.emit('order-user', {
            items: state.basket,
            table_slug: state.tableSlug,
            order_note: orderNote,
            table_name: tableInfo.name,
        });

        setOrderNote('');
        setIsBasketOpened(false);

        Swal.fire({
            title: 'Siparişiniz onaylandı',
            icon: 'success',
        });

        setState((prev) => ({ ...prev, basket: [] }));

        window?.sessionStorage?.setItem('basket', JSON.stringify([]));
    };

    const openMessagePopup = () => {
        Swal.fire({
            title: 'Garsona Mesaj Gönder',
            input: 'text',
            inputPlaceholder: 'Mesajınızı yazınız',
            showCancelButton: true,
            confirmButtonText: 'Gönder',
            preConfirm: (message) => {
                if (!message) {
                    return Swal.showValidationMessage('Mesaj boş olamaz');
                }
                return message;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('notification', {
                    message: result.value,
                    type: 'message',
                    table_slug: state.tableSlug,
                    table_name: tableInfo.name,
                });

                Swal.fire({
                    title: 'Mesajınız çalışanlarımıza iletildi.',
                    icon: 'success',
                });
            }
        });
    };

    const openCallWaiterPopup = () => {
        Swal.fire({
            title: 'Masanıza garson çağırmak istediğinizden emin misiniz?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır'
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('notification', {
                    type: 'call_waiter',
                    table_slug: state.tableSlug,
                    table_name: tableInfo.name,
                });

                Swal.fire({
                    title: 'Garson çağrısı yapıldı',
                    icon: 'success',
                });
            }
        });
    };

    const openBillRequestPopup = () => {
        Swal.fire({
            title: 'Hesabı masanıza göndermek istediğinizden emin misiniz?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır'
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('notification', {
                    type: 'bill_request',
                    table_slug: state.tableSlug,
                    table_name: tableInfo.name,
                });

                Swal.fire({
                    title: 'Hesap isteği gönderildi.',
                    icon: 'success',
                });
            }
        });
    };
    return (
        <div className={styles.basket}>
            <div className={styles.basketLeft}>
                <div onClick={openMessagePopup} className={styles.basketLeftIcon}>
                    <MdOutlineMessage />
                    <span>Mesaj gönder</span>
                </div>
                <div onClick={openCallWaiterPopup} className={styles.basketLeftIcon}>
                    <MdOutlineSupportAgent />
                    <span>Garson çağır</span>
                </div>
                <div onClick={openBillRequestPopup} className={styles.basketLeftIcon}>
                    <GiReceiveMoney />
                    <span>Hesabı iste</span>
                </div>
            </div>
            <div className={styles.basketIcon}>
                <PiBasketDuotone onClick={() => setIsBasketOpened(!isBasketOpened)} />
            </div>
            <div className={styles.basketAmount}>{state.basket.reduce((acc, item) => acc + item.quantity, 0)}</div>
            <div
                className={cn(styles.basketItems, { [styles.basketItems_open]: isBasketOpened })}
            >
                <div className={styles.basketItemsClose}>
                    <CloseIcon onClick={() => setIsBasketOpened(false)} />
                </div>
                {isBasketEmpty ? (
                    <div className={styles.basketItemsEmpty}>Sepetinizde ürün bulunmamaktadır.</div>
                ) : (
                    <div>
                        {state.basket.map((item, index) => {
                            return <BasketItem
                                key={index}
                                item={item}
                            />;
                        })}
                        <div className={styles.basketItemsOrderNote}>
                            <input
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                type="text"
                                id="order-note"
                                placeholder=''
                            />
                            <label htmlFor="order-note">Sipariş Notu:</label>
                        </div>
                    </div>
                )}
                <button
                    onClick={sendOrderToSocket}
                    className={cn(
                        styles.basketItemsOrder,
                        { [styles.basketItemsOrder_open]: (!isBasketEmpty && isBasketOpened) },
                    )}
                >
                    Siparişi Onayla
                    {` (${totalPrice}₺)`}
                </button>
            </div>
            <div className={cn(styles.basketBlur)}></div>
        </div>
    );
};

export default Basket;
