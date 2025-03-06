import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TextField } from '@mui/material';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppContext } from '@/app/context/appContext';
import axios from '@/app/lib/axios';
import commonStyles from '../common.module.scss';
import styles from './styles.module.scss';

const ContactSettings = () => {
    const { state: { settings }, reFetchSettings} = useAppContext();
    const [contactSettings, setContactSettings] = useState(null);

    useEffect(() => {
        if (settings && !contactSettings) {
            setContactSettings({
                phoneNumber: settings.phoneNumber,
                companyName: settings.companyName,
                address: settings.address,
            });
        }
    }, [settings]);

    const handleSave = async () => {
        const { data } = await axios.put('/settings/contact-info', {
            ...contactSettings,
        });

        if (data && data.status === 200) {
            reFetchSettings();

            Swal.fire({
                icon: 'success',
                title: 'Başarılı',
                text: 'İletişim Bilgileri Başarıyla Güncellendi',
            });
        };
    };

    return (
        <div className={commonStyles.wrapper}>
            <div className={commonStyles.title}>Yazı Ayarları</div>
            <div className={cn('container', commonStyles.topButtons)}>
                <button onClick={handleSave}>Kaydet <AddCircleIcon /></button>
            </div>
            {
                contactSettings && (
                    <div className={cn('container', styles.content)}>
                        <div className={styles.contentItem}>
                            <div className={styles.contentItemTitle}>Telefon:</div>
                            <TextField
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                variant="outlined"
                                label="Telefon"
                                className={styles.contentItemInput}
                                value={contactSettings?.phoneNumber}
                                onChange={(e) => {
                            setContactSettings({
                                ...contactSettings,
                                phoneNumber: e.target.value,
                            });
                        }}
                            />
                        </div>
                        <div className={styles.contentItem}>
                            <div className={styles.contentItemTitle}>Şirket Adı:</div>
                            <TextField
                                slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                                variant="outlined"
                                label="Şirket Adı"
                                className={styles.contentItemInput}
                                value={contactSettings?.companyName}
                                onChange={(e) => {
                            setContactSettings({
                                ...contactSettings,
                                companyName: e.target.value,
                            });
                        }}
                            />
                        </div>
                        <div className={styles.contentItem}>
                            <div className={styles.contentItemTitle}>Adres:</div>
                            <TextField
                                slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                                variant="outlined"
                                label="Adres"
                                className={styles.contentItemInput}
                                value={contactSettings?.address}
                                onChange={(e) => {
                            setContactSettings({
                                ...contactSettings,
                                address: e.target.value,
                            });
                        }}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ContactSettings;