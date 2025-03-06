import { useAppContext } from '@/app/context/appContext';
import styles from './styles.module.scss';

const Loader = () => {
    const {state} = useAppContext();

    return (
        state?.loading &&
                (<div className={styles.loader}>
                    <span className={styles.loaderElement}></span>
                    <span className={styles.loaderElement}></span>
                    <span className={styles.loaderElement}></span>
                </div>
                )
    );
};

export default Loader;
