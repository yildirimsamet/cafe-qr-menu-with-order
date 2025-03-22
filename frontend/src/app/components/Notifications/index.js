import useNotification from '@/app/hooks/useNotification';
import styles from './styles.module.scss';
import Notification from './Notification';
import cn from 'classnames';
import usePageDimensions from '@/app/hooks/usePageDimensions';

const Notifications = () => {
    const { notifications, deleteNotification } = useNotification();
    const { height } = usePageDimensions();

    return (
        <div className={styles.notifications}>
            <div className={styles.notificationsTitle}>
                Bildirimler
            </div>
            {notifications.length ?
                <div className={cn(styles.notificationsList, height >= 70 && styles.notificationsListSticky)}>
                    {notifications?.map(notification => (
                        <Notification
                            key={notification.id}
                            {...notification}
                            onDelete={() => deleteNotification(notification.id)}
                        />
                    ))}
                </div> : <div className={styles.notificationsEmpty}>Bildirim bulunmamaktadır.</div>}
        </div>
    );
};

export default Notifications;