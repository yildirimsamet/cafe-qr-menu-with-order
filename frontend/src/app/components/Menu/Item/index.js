'use client';

import AddIcon from '@mui/icons-material/Add';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/context/appContext';
import styles from './styles.module.scss';

const Item = ({ item }) => {
    const [selectedSize, setSelectedSize] = useState({});
    const [quantity, setQuantity] = useState(1);
    const { state, setState } = useAppContext();

    const updateQuantity = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity <= 0) {
            return;
        }

        setQuantity(newQuantity);
    };

    useEffect(() => {
        setSelectedSize(item.sizes?.[0]);
        setQuantity(1);
    }, [item]);

    const addToBasket = () => {
        const existItem = state.basket.find((basketItem) =>
            basketItem.item_id === item.item_id &&
            basketItem.size_id === selectedSize.size_id);
        const newState = { ...state };

        if (existItem) {
            newState.basket = state.basket.map((basketItem) => {
                if (
                    basketItem.item_id === item.item_id &&
                    basketItem.size_id === selectedSize.size_id
                ) {
                    return {
                        ...basketItem,
                        quantity: basketItem.quantity + Number(quantity),
                    };
                }
                return basketItem;
            });
        } else {
            newState.basket.push({
                name: item.item_name,
                size_name: selectedSize.size_name,
                item_id: item.item_id,
                size_id: selectedSize.size_id,
                quantity: Number(quantity),
                price: selectedSize.size_price,
            });
        }

        setState(newState);

        window?.sessionStorage?.setItem('basket', JSON.stringify(newState.basket));
    };

    return (
        <div className={styles.container}>
            <div className={cn(styles.item, { [styles.outOfStock]: !item.item_in_stock })}>
                <div className={styles.itemImage}>
                    <img
                        src={
                            item.item_image
                                ? `${process.env.NEXT_PUBLIC_API_URL}/assets/images/${item.item_image}`
                                : `${process.env.NEXT_PUBLIC_API_URL}/assets/images/${state?.settings.logo}`
                        }
                        alt=""
                    />
                </div>
                <div className={styles.itemContent}>
                    <div className={styles.itemContentName}>{item.item_name}</div>
                    <div className={styles.itemContentDescription}>
                        {item.item_description}
                    </div>
                    <select
                        className={styles.itemContentSize}
                        onChange={(e) => {
                            setSelectedSize(item.sizes.find((size) => size.size_name === e.target.value));
                        }}
                    >
                        {item.sizes?.map((size, index) => {
                            return (
                                <option
                                    value={size.size_name}
                                    key={index}
                                >
                                    {size.size_name}
                                </option>
                            );
                        })}
                    </select>
                    <div className={styles.itemContentQuantity}>
                        <button
                            className={styles.itemContentQuantityDecrease}
                            onClick={() => updateQuantity(-1)}
                        >
                            -
                        </button>
                        <span className={styles.itemContentQuantityAmount}>{quantity}</span>
                        <button
                            className={styles.itemContentQuantityIncrease}
                            onClick={() => updateQuantity(1)}
                        >
                            +
                        </button>
                    </div>

                    <div className={styles.itemContentBottom}>
                        <div className={styles.itemContentBottomPrice}>
                            {(selectedSize?.size_price || 0 * quantity).toFixed(2)}₺
                        </div>
                        <button
                            onClick={addToBasket}
                            className={cn(styles.itemContentBottomAdd, {
                                'display-none': !selectedSize,
                            })}
                        >
                            Ekle <AddIcon />
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ display: 'none' }} className={cn({ [styles.outOfStockText]: !item.item_in_stock })}>
                Tükendi
            </div>
        </div>
    );
};

export default Item;
