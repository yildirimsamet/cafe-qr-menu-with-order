'use client';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';
import axios from '@/app/lib/axios';
import commonStyles from '../common.module.scss';
import styles from './styles.module.scss';

const EditSizes = () => {
    const { data: sizes = [], mutate, isValidating } = useSWR('/sizes', (url) => {
        try {
            return axios.get(url).then(res => res.data.data);
        } catch (error) {
            return [];
        }
    });
    const [changedSizes, setChangedSizes] = useState([]);

    const handleChange = (event, id) => {
        const { value } = event.target;

        setChangedSizes(prev => {
            const existingIndex = prev.findIndex(size => size.id === id);
            const originalSize = sizes.find(size => size.id === id);

            if (originalSize && originalSize.name === value) {
                return prev.filter(size => size.id !== id);
            }

            if (existingIndex !== -1) {
                const updatedSizes = [...prev];
                updatedSizes[existingIndex].name = value;
                return updatedSizes;
            } else {
                return [...prev, { id, name: value }];
            }
        });
    };

    const openSizeAddModel = () => {
        Swal.fire({
            title: 'Yeni Boyut Ekle',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Ekle',
            showLoaderOnConfirm: true,
            preConfirm: async (value) => {
                if (!value) {
                    Swal.showValidationMessage('Boyut adını giriniz');
                } else {
                    try {
                        return await axios.post('/sizes', { name: value }).then(async (res) => {
                            mutate();
                            setChangedSizes([]);
                            return;
                        }).catch((error) => {
                            Swal.showValidationMessage('Aynı boyut adına sahip bir boyut zaten mevcut!');
                            return;
                        });
                    } catch (error) {
                        //
                    }
                }

            },
        });
    };

    const handleSave = async () => {
        let isSaveable = true;

        changedSizes.forEach(size => {
            if (!size.name || size.name.trim() === '') {
                isSaveable = false;
            }
        });

        if (!isSaveable) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Boyut adı bos bırakılamaz!',
            });
            return;
        }

        try {
            for (let i = 0; i < changedSizes.length; i++) {
                await axios.put(`/sizes/${changedSizes[i].id}`, { name: changedSizes[i].name });
            }

            mutate();
            setChangedSizes([]);

            Swal.fire({
                icon: 'success',
                title: 'Tebrikler',
                text: 'Boyutlar kaydedildi!',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Boyutlar kaydedilemedi!',
            });
        }
    };

    const openDeleteSizeModal = (id) => {
        Swal.fire({
            title: 'Boyut Sil',
            text: 'Bu boyutu silmek istiyor musunuz?',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    return await axios.delete(`/sizes/${id}`)
                        .then(async (res) => {
                            mutate();
                            setChangedSizes(prev => prev.filter(size => size.id !== id));
                            return;
                        }).catch((error) => {
                            Swal.showValidationMessage('Boyut ürünlerde kullanılmakta!');
                        });
                } catch (error) {
                    //
                }
            },
        });
    };
    return (
        <div>
            <h1 className={commonStyles.title}>Boyut Düzenle</h1>
            <div className={cn('container', commonStyles.addButtonWrapper)}>
                <button
                    className={commonStyles.addButton}
                    onClick={openSizeAddModel}
                >
                    Boyut Ekle <AddCircleIcon />
                </button>
                <button
                    onClick={handleSave}
                    className={commonStyles.saveButton}
                >
                    Değişiklikleri Kaydet <SaveAltIcon />
                </button>
            </div>
            <div className={cn('container', styles.sizes)}>
                {!isValidating && sizes?.map((size, index) => {
                    return (
                        <div
                            key={index}
                            className={styles.size}
                        >
                            <TextField
                                slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                                label={size.name}
                                defaultValue={size.name}
                                onChange={(event) => {
                                handleChange(event, size.id);
                            }}
                            />
                            <div className={styles.sizeDelete}>
                                <IconButton
                                    onClick={() => {
                                    openDeleteSizeModal(size.id);
                                }}
                                    edge="end"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EditSizes;
