import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TextField } from '@mui/material';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import axios from '@/app/lib/axios';
import commonStyles from '../common.module.scss';
import styles from './styles.module.scss';

const LogoSettings = () => {
    const { state: { settings } } = useAppContext();
    const [image, setImage] = useState(null);
    const [imageInputName, setImageInputName] = useState('');

    useEffect(() => {
        if (settings?.logo && !image) {
            setImage(settings.logo);
        }
    }, [settings]);

    const checkErrors = () => {
        if (typeof image == 'string') {
            return 'Lütfen yeni bir resim seçiniz.';
        }

        if (!image) {
            return 'Lütfen bir resim seçiniz.';
        }

        return false;
    };

    const handleUpdate = () => {
        const errors = checkErrors();

        if (errors) {
            return Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: errors,
            });
        }

        const formData = new FormData();
        formData.append('logo', image);

        axios.post('/settings/update-logo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                if (data.status === 200) {
                    return Swal.fire({
                        icon: 'success',
                        title: 'Başarılı',
                        text: 'Logo Başarıyla Güncellendi',
                    });
                }

                return Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: 'Logo Güncellenemedi',
                });
            })
            .catch((error) => {
                return Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: 'Logo Güncellenemedi',
                });
            });
    };

    return (
        <div className={commonStyles.wrapper}>
            <div className={commonStyles.title}>Logo Ayarları</div>
            <div className={cn('container', commonStyles.topButtons)}>
                <button onClick={handleUpdate}>
                    Kaydet <AddCircleIcon />
                </button>
            </div>
            <div className={cn('container', styles.content)}>
                {image ? <div
                    className={styles.contentImage}
                    style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}
                >
                    <IconButton
                        onClick={() => {
                            setImage(null);
                            setImageInputName('');
                        }}
                        style={{ position: 'absolute', top: -36, left: -36, color: 'red', zIndex: 9 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={
                        typeof image === 'string' ? process.env.NEXT_PUBLIC_API_URL + '/assets/images/' + image : URL.createObjectURL(image)
                    }
                        alt="Resim"
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                </div> : <div className={styles.contentImageNotSelected}>Resim Seçilmedi</div>}
                <TextField
                    className={styles.contentInput}
                    type="file"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                        backdrop: {
                            invisible: true,
                        },
                    }}
                    label="Resim"
                    value={imageInputName}
                    onChange={(e) => {
                        setImage(e.target.files[0]);
                        setImageInputName(e.target.value);
                    }}
                />
            </div>
        </div>
    );
};

export default LogoSettings;