'use client';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import Menu from '@/app/components/Menu';
import { useAppContext } from '@/app/context/appContext';
import axios from '@/app/lib/axios';
import { socket } from '@/app/lib/socket';
import styles from './styles.module.scss';

const Table = ({ params: { tableSlug } }) => {
    const { state, setState } = useAppContext();
    const [menu, setMenu] = useState([]);
    const [isMenuOpened, setIsMenuOpened] = useState(true);
    const [isTableValid, setIsTableValid] = useState(true);

    const getTable = async () => {
        try {
            const { data } = await axios.get(`/tables/${tableSlug}`);

            if (data.data) {
                setIsTableValid(true);
            } else {
                setIsTableValid(false);
            }
        } catch (error) {
            setIsTableValid(false);
        }
    };

    useEffect(() => {
        getTable();
    }, [tableSlug]);

    const getMenus = async () => {
        try {
            const { data } = await axios.get('/menu');
            setMenu(data.data);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        getMenus();

        state.basket = JSON.parse(window?.sessionStorage?.getItem('basket')) || [];
        state.tableSlug = tableSlug;

        setState(state);
    }, []);

    socket.connect();

    return (
        <div className={styles.main}>
            <div className={styles.mainSection}>
                <img className={styles.mainSectionImage} src={`${process.env.NEXT_PUBLIC_API_URL}/assets/images/${state?.settings?.logo}`} alt="" />
                <h3 className={styles.mainSectionTitle}>{state?.settings?.companyName}</h3>
                <p className={styles.mainSectionAdress}>{state?.settings?.adress}</p>
                <p className={styles.mainSectionPhone}>{state?.settings?.phone}</p>
            </div>
            {
                isTableValid ? (
                    <div className={cn(styles.mainMenu, (isMenuOpened && styles.mainMenu_open))}>
                        <div className={styles.mainMenuClose} onClick={() => setIsMenuOpened(!isMenuOpened)}>Kapat</div>
                        <Menu menu={menu} />
                    </div>
                ) : (
                    <div className={styles.mainMenu}>
                        <div className={styles.mainMenuTableNotFound}>Bu masa mevcut değil</div>
                    </div>
                )
            }
            <button onClick={() => setIsMenuOpened(!isMenuOpened)} className={styles.mainButton}>Menü</button>
        </div>
    );
};

export default Table;
