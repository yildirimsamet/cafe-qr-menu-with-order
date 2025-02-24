'use client';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import Basket from '@/app/components/Basket';
import Items from '@/app/components/Menu/Items';
import { useAppContext } from '@/app/context/appContext';
import Category from './Category';
import styles from './styles.module.scss';

const Menu = ({ menu }) => {
    const [isItemsMenuOpened, setIsItemsMenuOpened] = useState(false);
    const { state, setState } = useAppContext();

    return (
        <div className={styles.menu}>
            <Basket />
            <div className={styles.menuTitle}>Menü</div>
            {menu.map((category, index) => {
                return <Category onClick={() => {
                    setState({
                        ...state,
                        listItems: category.items,
                    });
                    setIsItemsMenuOpened(true);
                }} key={index} category={category}
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
