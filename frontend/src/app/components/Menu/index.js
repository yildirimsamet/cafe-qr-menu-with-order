'use client';

import { useState } from 'react';
import Basket from '@/app/components/Basket';
import Items from '@/app/components/Menu/Items';
import { useAppContext } from '@/app/context/appContext';
import Category from './Category';
import styles from './styles.module.scss';

const Menu = ({ menu, tableInfo }) => {
    const [isItemsMenuOpened, setIsItemsMenuOpened] = useState(false);
    const { setState } = useAppContext();

    return (
        <div className={styles.menu}>
            <Basket tableInfo={tableInfo} />
            <div className={styles.menuTitle}>Menü</div>
            {menu.map((category, index) => {
                return <Category
                    onClick={() => {
                    setState((prev) => ({ ...prev, listItems: category.items }));
                    setIsItemsMenuOpened(true);
                }}
                    key={index}
                    category={category}
                />;
            })}
            <Items
                isItemsMenuOpened={isItemsMenuOpened}
                setIsItemsMenuOpened={setIsItemsMenuOpened}
            />
        </div>
    );
};

export default Menu;
