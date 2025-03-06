import AddCircleIcon from '@mui/icons-material/AddCircle';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import axios from '@/app/lib/axios';
import commonStyles from '../common.module.scss';
import Color from './Color';
import styles from './styles.module.scss';

const ColorSettings = () => {
    const { state: { settings: { colors } }, reFetchSettings } = useAppContext();
    const [changedColors, setChangedColors] = useState({});
    const [isColorsAreValid, setIsColorsAreValid] = useState(true);

    useEffect(() => {
        if (Object.keys(changedColors).length > 0) {
            setIsColorsAreValid(Object.values(changedColors).every((color) => isValidHexColor(color)));
        }
    }, [changedColors]);

    const isValidHexColor = (color) => {
        const hexRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
        return hexRegex.test(color);
    };

    const handleSave = () => {
        if (!isColorsAreValid) {
            return Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Renklerde hata var!',
            });
        }

        Swal.fire({
            icon: 'question',
            title: 'Onayla',
            text: 'Renkleri kaydetmek istiyor musunuz?',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.put('/settings/colors', { colors: {...colors, ...changedColors} }).then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Renkler kaydedildi!',
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        reFetchSettings();
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: 'Renkler kaydedilemedi!',
                    });
                }
            }
        });
    };
    return (
        <div className={commonStyles.wrapper}>
            <div className={commonStyles.title}>Renk Ayarları</div>
            <div className={cn('container', commonStyles.topButtons)}><button onClick={handleSave}>Kaydet <AddCircleIcon /></button></div>
            <div className={cn('container', styles.content)}>
                {
                    Object.keys(colors || {}).map((key, index) => (
                        <Color
                            key={index}
                            name={key}
                            value={colors[key]}
                            isValidHexColor={isValidHexColor}
                            setChangedColors={setChangedColors}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default ColorSettings;