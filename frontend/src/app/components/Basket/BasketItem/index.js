'use client';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import { formatPrice } from '@/app/utils';
import styles from './styles.module.scss';

const BasketItem = ({ item }) => {
    const { state, setState } = useAppContext();
    const [quantity, setQuantity] = useState(item.quantity);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item]);

    const updateQuantity = (change) => {
        const newQuantity = quantity + change;

        if (newQuantity <= 0) {
            return;
        }

        const newState = { ...state };

        newState.basket = state.basket.map((basketItem) => {
            if (
                basketItem.item_id === item.item_id &&
                basketItem.size_id === item.size_id
            ) {
                return {
                    ...basketItem,
                    quantity: newQuantity,
                };
            }
            return basketItem;
        });

        setQuantity(newQuantity);

        setState(newState);

        window?.sessionStorage?.setItem('basket', JSON.stringify(newState.basket));
    };

    const deleteItem = () => {
        const newState = { ...state };

        newState.basket = state.basket.filter((basketItem) =>
                !(
                    basketItem.item_id === item.item_id &&
                    basketItem.size_id === item.size_id
                ));

        setState(newState);

        window?.sessionStorage?.setItem('basket', JSON.stringify(newState.basket));
    };

    const openDeleteModal = () => {
        Swal.fire({
            title: 'Silmek istediğinizden emin misiniz?',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItem();
            }
        });
    };

    return (
        <div className={styles.item}>
            <div
                onClick={openDeleteModal}
                className={styles.itemDelete}
            >
                <DeleteForeverIcon />
            </div>
            <div className={styles.itemName}>{item.name}</div>
            <div className={styles.itemSize}>{item.size_name}</div>
            <div className={styles.itemQuantity}>
                <button
                    className={styles.itemQuantityDecrease}
                    onClick={() => updateQuantity(-1)}
                >
                    -
                </button>
                <span className={styles.itemQuantityAmount}>{quantity}</span>
                <button
                    className={styles.itemQuantityIncrease}
                    onClick={() => updateQuantity(1)}
                >
                    +
                </button>
            </div>
            <div className={styles.itemPrice}>{formatPrice(item.price * quantity)} ₺</div>
        </div>
    );
};

export default BasketItem;
