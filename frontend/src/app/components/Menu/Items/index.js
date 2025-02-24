import cn from 'classnames';
import Item from '@/app/components/Menu/Item';
import { useAppContext } from '@/app/context/appContext';
import styles from './styles.module.scss';

const Items = ({ isItemsMenuOpened, setIsItemsMenuOpened }) => {
    const { state } = useAppContext();
    const { listItems } = state;

    return (
        <div className={cn(styles.items, {[styles.items_open]: isItemsMenuOpened})}>
            {listItems.map((item, index) => {
                return <Item key={index} item={item} />;
            })}
            <button onClick={() => {
                setIsItemsMenuOpened(false);
            }} className={cn(styles.itemsBack, {[styles.itemsBack_open]: isItemsMenuOpened})}
            >{'< Menü'}</button>
        </div>
    );
};

export default Items;
