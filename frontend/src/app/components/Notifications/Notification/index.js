import styles from './styles.module.scss';
import { MdOutlineRestaurant } from 'react-icons/md';
import { FaReceipt } from 'react-icons/fa';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Notification = ({ message, type, onDelete, table_name }) => {
    //Types: 'message, call_waiter, bill_request'

    const getTypeContent = () => {
        switch (type) {
            case 'call_waiter':
                return (
                    <>
                        Garson Çağırıyor <MdOutlineRestaurant className={styles.icon} />
                    </>
                );
            case 'bill_request':
                return (
                    <>
                        Hesabı İstiyor <FaReceipt className={styles.icon} />
                    </>
                );
            default:
                return message;
        }
    };

    return (
        <div className={styles.notification}>
            <DeleteForeverIcon onClick={onDelete} className={styles.notificationDelete} />
            <div className={styles.notificationTitle}>
                {table_name}
            </div>
            <div className={styles.notificationMessage}>
                {getTypeContent()}
            </div>
        </div>
    );
};

export default Notification;