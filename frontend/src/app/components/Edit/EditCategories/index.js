'use client';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from '@/app/lib/axios';
import commonStyles from '../common.module.scss';
import styles from './styles.module.scss';

const EditCategories = () => {
    const [categories, setCategories] = useState([]);
    const [changedCategories, setChangedCategories] = useState([]);

    const getCategories = async () => {
        try {
            const { data } = await axios.get('/categories');

            setCategories(data.data);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleChange = (event, id) => {
        const { value } = event.target;

        setChangedCategories(prev => {
            const existingIndex = prev.findIndex(category => category.id === id);
            const originalCategory = categories.find(category => category.id === id);

            if (originalCategory && originalCategory.name === value) {
                return prev.filter(category => category.id !== id);
            }

            if (existingIndex !== -1) {
                const updatedCategories = [...prev];
                updatedCategories[existingIndex].name = value;
                return updatedCategories;
            } else {
                return [...prev, { id, name: value }];
            }
        });
    };

    const openCategoryModel = () => {
        Swal.fire({
            title: 'Yeni Kategori Ekle',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Ekle',
            showLoaderOnConfirm: true,
            preConfirm: async (value) => {
                if (!value) {
                    Swal.showValidationMessage('Kategori adını giriniz');
                } else {
                    try {
                        return await axios.post('/categories', { name: value }).then(async (res) => {
                            await getCategories();
                            setChangedCategories([]);
                            return;
                        }).catch((error) => {
                            Swal.showValidationMessage('Aynı kategori adına sahip bir kategori zaten mevcut!');
                            return;
                        });
                    } catch (error) {
                        return;
                    }
                }

            },
        });
    };

    const handleSave = async () => {
        let isSaveable = true;

        changedCategories.forEach(category => {
            if (!category.name || category.name.trim() === '') {
                isSaveable = false;
            }
        });

        if (!isSaveable) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Kategori adı boş bırakılamaz!',
            });
            return;
        }

        try {
            for (let i = 0; i < changedCategories.length; i++) {
                try {
                    await axios.put(`/categories/${changedCategories[i].id}`, { name: changedCategories[i].name });
                } catch (error) {
                    return;
                }
            }

            await getCategories();

            setChangedCategories([]);

            Swal.fire({
                icon: 'success',
                title: 'Tebrikler',
                text: 'Kategoriler kaydedildi!',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Kategoriler kaydedilemedi!',
            });
        }
    };

    const openDeleteCategoryModal = (id) => {
        Swal.fire({
            title: 'Kategori Sil',
            text: 'Bu kategoriyi silmek istiyor musunuz?',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    return await axios.delete(`/categories/${id}`)
                        .then(async (res) => {
                            setCategories(prev => prev.filter(category => category.id !== id));
                            setChangedCategories(prev => prev.filter(category => category.id !== id));
                            return;
                        }).catch((error) => {
                            Swal.showValidationMessage('Kategori ürünlerde kullanılmakta!');
                        });
                } catch (error) {
                    return;
                }
            },
        });
    };
    return (
        <div>
            <h1 className={commonStyles.title}>Kategori Düzenle</h1>
            <div className={cn('container', commonStyles.addButtonWrapper)}>
                <button className={commonStyles.addButton} onClick={openCategoryModel}>
                    Kategori Ekle <AddCircleIcon />
                </button>
                <button onClick={handleSave} className={commonStyles.saveButton}>Değişiklikleri Kaydet <SaveAltIcon /></button>
            </div>
            <div className={cn('container', styles.categories)}>
                {categories.map((category, index) => {
                    return (
                        <div key={index} className={styles.category}>
                            <OutlinedInput label="Kategori Adı" defaultValue={category.name} onChange={(event) => {
                                handleChange(event, category.id);
                            }} variant="outlined" endAdornment={
                                <InputAdornment>
                                    <IconButton
                                        onClick={() => {
                                            openDeleteCategoryModal(category.id);
                                        }}
                                        edge="end"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EditCategories;
