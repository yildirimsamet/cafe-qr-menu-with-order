import { useAppContext } from '@/app/context/appContext';
import styles from './styles.module.scss';

const Loader = () => {
    const {state} = useAppContext();

    return (
        state?.loading &&
                (<div className={styles.loader}>
                    <div className={styles.loaderInner}>
                        <div className={styles.loaderInnerCorpus}></div>
                        <div className={styles.loaderInnerSpinner}></div>
                    </div>
                    <div className={styles.loaderText}>&nbsp;Yükleniyor ...</div>
                </div>
                )
    );
};

export default Loader;
