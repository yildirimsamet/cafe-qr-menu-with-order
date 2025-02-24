'use client';

import CloseIcon from '@mui/icons-material/Close';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import { socket } from '@/app/lib/socket';
import BasketItem from './BasketItem';
import styles from './styles.module.scss';

const Basket = () => {
    const { state, setState } = useAppContext();
    const [isBasketOpened, setIsBasketOpened] = useState(false);
    const isBasketEmpty = state.basket.length <= 0;

    const sendOrderToSocket = () => {
        socket.emit('order-user', { items: state.basket, table_slug: state.tableSlug });

        setIsBasketOpened(false);

        Swal.fire({
            title: 'Siparişiniz onaylandı',
            icon: 'success',
        });

        setState({
            ...state,
            basket: [],
        });

        window?.sessionStorage?.setItem('basket', JSON.stringify([]));
    };

    return (
        <div className={styles.basket}>
            <div className={styles.basketIcon}>
                <ShoppingBasketIcon onClick={() => setIsBasketOpened(!isBasketOpened)} />
            </div>
            <div className={styles.basketAmount}>{state.basket.reduce((acc, item) => acc + item.quantity, 0)}</div>
            <div onClick={() => setIsBasketOpened(false)} className={cn(styles.basketItems, { [styles.basketItems_open]: isBasketOpened })}>
                <div className={styles.basketItemsClose}>
                    <CloseIcon onClick={() => setIsBasketOpened(false)} />
                </div>
                {isBasketEmpty ? (
                    <div className={styles.basketItemsEmpty}>Sepetinizde ürün bulunmamaktadır.</div>
                ) : (state.basket.map((item, index) => {
                    return <BasketItem key={index} item={item} />;
                }))}
                <button onClick={sendOrderToSocket} className={cn(
                    styles.basketItemsOrder,
                    { [styles.basketItemsOrder_open]: (!isBasketEmpty && isBasketOpened) },
                )}
                >
                    Siparişi Onayla
                </button>
            </div>
            <div className={cn(styles.basketBlur)}></div>
        </div>
    );
};

export default Basket;
