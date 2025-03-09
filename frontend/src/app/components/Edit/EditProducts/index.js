'use client';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';
import { useAppContext } from '@/app/context/appContext';
import axios from '@/app/lib/axios';
import { formatPrice } from '@/app/utils';
import commonStyles from '../common.module.scss';
import ProductAddModel from './ProductAddModel';
import ProductEditModel from './ProductEditModel';
import styles from './styles.module.scss';

const EditProducts = () => {
    const { state: { settings } } = useAppContext();

    const [isProductAddModelOpened, setIsProductAddModelOpened] = useState(false);
    const [isProductEditModelOpened, setIsProductEditModelOpened] = useState(false);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState({});
    const { data: products = [], mutate } = useSWR('/items', (url) => {
        try {
            return axios.get(url).then(res => res.data.data);
        } catch (error) {
            return [];
        }
    });

    const openProductAddModel = () => {
        setIsProductAddModelOpened(true);
    };

    const openProductDeleteModel = (productId) => {
        Swal.fire({
            title: 'Silmek istediğinizden emin misiniz?',
            showDenyButton: true,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/items/delete/${productId}`).then(res => {
                        mutate();
                    }).catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Bir hata oluştu.',
                            text: 'Ürün silinirken bir hata olştu.',
                        });
                    });
                } catch (error) {
                    return;
                }
            }
        });
    };

    return (
        <div className={styles.editProducts}>
            <h1 className={commonStyles.title}>Ürün Düzenle</h1>
            <div className={cn('container', commonStyles.addButtonWrapper)}>
                <button className={commonStyles.addButton} onClick={openProductAddModel}>
                    Ürün Ekle <AddCircleIcon />
                </button>
            </div>
            {isProductAddModelOpened &&
                <ProductAddModel
                    mutate={mutate}
                    isProductAddModelOpened={isProductAddModelOpened}
                    setIsProductAddModelOpened={setIsProductAddModelOpened}
                />}
            {isProductEditModelOpened &&
                <ProductEditModel
                    mutate={mutate}
                    selectedProductForEdit={selectedProductForEdit}
                    isProductEditModelOpened={isProductEditModelOpened}
                    setIsProductEditModelOpened={setIsProductEditModelOpened}
                />}
            <div className={cn(styles.editProductsList, 'container')}>
                {products?.map((productsInfo, index) => {
                    return (
                        <div key={index} className={styles.editProductsListItem}>
                            <div className={styles.editProductsListItemTitle}>
                                {productsInfo.category_name}
                            </div>
                            <div className={styles.editProductsListItemProducts}>
                                {productsInfo.items.length > 0 ? productsInfo.items.map((product, index) => {
                                    return (
                                        <div key={index} className={styles.editProductsListItemProductsItem}>
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}/assets/images/${
                                                    product.item_image || settings?.logo
                                                }`}
                                                alt="Ürün Resmi"
                                                className={styles.editProductsListItemProductsItemImage}
                                            />
                                            <div className={styles.editProductsListItemProductsItemName}>{
                                                product.item_name}
                                            </div>
                                            <div className={styles.editProductsListItemProductsItemDescription}>
                                                {product.item_description}
                                            </div>
                                            <div className={styles.editProductsListItemProductsItemCategory}>
                                                {productsInfo.category_name}
                                            </div>
                                            <div className={styles.editProductsListItemProductsItemPrice}>
                                                {
                                                    product.sizes?.map((size, index) => {
                                                        return (
                                                            <div key={index}>
                                                                {size.size_name}: <span>
                                                                    {formatPrice(size.size_price)} ₺
                                                                </span>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className={styles.editProductsListItemProductsItemActions}>
                                                <button onClick={
                                                    () => {
                                                        setSelectedProductForEdit({
                                                            ...product, category: {
                                                                category_id: productsInfo.category_id,
                                                                category_name: productsInfo.category_name,
                                                            },
                                                        });
                                                        setIsProductEditModelOpened(true);
                                                    }
                                                } className={styles.editProductsListItemProductsItemActionsEdit}
                                                >Düzenle</button>
                                                <button onClick={() => {
                                                    openProductDeleteModel(product.item_id);
                                                }} className={styles.editProductsListItemProductsItemActionsDelete}
                                                >Sil</button>
                                            </div>
                                        </div>
                                    );
                                }) : <div className={styles.editProductsListItemProductsItemEmpty}>
                                    Bu kategoride ürün bulunmamaktadır.
                                </div>}
                            </div>
                        </div>
                    );
                })
                }
            </div>
        </div>
    );
};

export default EditProducts;
