import AddCircleIcon from '@mui/icons-material/AddCircle';
import cn from 'classnames';
import commonStyles from '../common.module.scss';
import styles from './styles.module.scss';

const TextSettings = () => {
    return (
        <div className={commonStyles.wrapper}>
            <div className={commonStyles.title}>Yazı Ayarları</div>
            <div className={cn('container', commonStyles.topButtons)}><button>Kaydet <AddCircleIcon /></button></div>
            <div className={cn('container', styles.content)}></div>
        </div>
    );
};

export default TextSettings;