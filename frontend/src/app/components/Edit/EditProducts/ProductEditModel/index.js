import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    Button,
    InputLabel,
    FormControl,
    IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from '@/app/lib/axios';

const ProductEditModel = ({mutate, selectedProductForEdit, isProductEditModelOpened, setIsProductEditModelOpened }) => {
    const [product, setProduct] = useState({
        name: selectedProductForEdit.item_name,
        description: selectedProductForEdit.item_description,
        image: selectedProductForEdit.item_image,
        category: selectedProductForEdit.category.category_id,
        sizes: [...selectedProductForEdit.sizes.map((size) => ({ size_id: size.size_id, price: size.size_price }))],
    });
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [imageInputName, setImageInputName] = useState('');

    const getCategoriesAndSizes = async () => {
        try {
            const [categoriesData, sizesData] = await axios.all([
                axios.get('/categories'),
                axios.get('/sizes'),
            ]);
            setCategories(categoriesData.data.data);
            setSizes(sizesData.data.data);
        } catch (error) {
            console.error('Veriler alınırken hata oluştu:', error);
        }
    };

    useEffect(() => {
        getCategoriesAndSizes();
    }, []);

    const handleSizeChange = (sizeId) => {
        const productNewSizes = product.sizes;

        if (productNewSizes.find((id) => id === sizeId)) {
            productNewSizes.filter((id) => id !== sizeId);
        } else {
            productNewSizes.push({
                size_id: sizeId,
                price: 0,
            });
        }

        setProduct({ ...product, sizes: productNewSizes });
    };

    const handleSave = async () => {
        const errors = checkErrors();

        if (errors) {
            return Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: errors,
            });
        }

        try {
            const formData = new FormData();
            Object.keys(product).forEach((key) => {
                if (key === 'image' && typeof product[key] === 'object') {
                    formData.append(key, product[key]);
                } else if (key === 'sizes') {
                    product[key].forEach((size) => {
                        formData.append('sizes[]', JSON.stringify(size));
                    });
                } else {
                    formData.append(key, product[key]);
                }
            });

            const response = await axios.put(`/items/edit/${selectedProductForEdit.item_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 200) {
                mutate();

                Swal.fire({
                    icon: 'success',
                    title: 'Ürün güncellendi.',
                    text: response.data.data.name,
                }).then(() => {
                    setIsProductEditModelOpened(false);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: response.data.error,
                });
            }
        } catch (error) {
            console.error('Veriler alınırken hata oluştu:', error);
        }
    };

    const checkErrors = () => {
        if (!product.name) {
            return 'Ürün adı bos bırakılamaz!';
        }

        if (!product.category) {
            return 'Kategori alanı bos bırakılamaz!';
        }

        if (!product.sizes.length) {
            return 'En az bir boyut eklemelisiz!';
        }

        if (product.sizes.some((size) => !size.price)) {
            return 'Boyut fiyatı boş bırakılamaz!';
        }

        return false;
    };

    return (
        <Dialog closeAfterTransition={false} open={isProductEditModelOpened} onClose={() => setIsProductEditModelOpened(false)} fullWidth maxWidth="sm">
            <DialogTitle>
                Ürün Ekle
                <IconButton onClick={() => setIsProductEditModelOpened(false)} style={{ position: 'absolute', right: 10, top: 10 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Ürün Adı"
                    variant="outlined"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    fullWidth
                    margin="dense"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
                <TextField
                    label="Açıklama"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    fullWidth
                    multiline
                    rows={3}
                    margin="dense"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
                <TextField
                    type="file"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    label="Resim"
                    fullWidth
                    margin="dense"
                    inputProps={{ accept: 'image/*' }}
                    value={imageInputName}
                    onChange={(e) => {
                        setProduct({ ...product, image: e.target.files[0] });
                        setImageInputName(e.target.value);
                    }}
                />
                {product.image && <div
                    style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}
                >
                    <IconButton
                        onClick={() => {
                            setProduct({ ...product, image: null });
                            setImageInputName('');
                        }}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img src={
                        typeof product.image === 'string' ? process.env.NEXT_PUBLIC_API_URL + '/assets/images/' + product.image : URL.createObjectURL(product.image)
                    } alt="Resim" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                </div>}
                <FormControl fullWidth margin="dense">
                    <InputLabel>Kategori</InputLabel>
                    <Select
                        label="Kategori"
                        slotProps={{
                            inputLabel: {
                                shrink: false,
                            },
                        }}
                        value={product?.category || null}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Size'lar</InputLabel>
                    <Select
                        label="Size'lar"
                        slotProps={{
                            inputLabel: {
                                shrink: false,
                            },
                        }}
                        multiple
                        value={product?.sizes.map(size => size.size_id) || null}
                        onChange={(e) => {
                            const selectedSizeIds = e.target.value;
                            const newSizes = selectedSizeIds.map(sizeId => {
                                const existingSize = product.sizes.find(size => size.size_id === sizeId);
                                return existingSize ? existingSize : { size_id: sizeId, price: 0 };
                            });
                            setProduct({ ...product, sizes: newSizes });
                        }}
                    >
                        {sizes.map((size, index) => (
                            <MenuItem
                                onClick={() => {
                                    const isSelected = product.sizes.some(s => s.size_id === size.id);
                                    handleSizeChange(size.id, isSelected);
                                }}
                                key={size.id} value={size.id}
                            >
                                {size.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {product.sizes.map((size) => {
                    return (
                        <TextField
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            key={size.size_id}
                            label={`Fiyat (${sizes.find((s) => s.id === size.size_id)?.name})`}
                            fullWidth
                            type="number"
                            margin="dense"
                            value={size.price || ''}
                            onChange={(e) => {
                                const newPrice = e.target.value;
                                const updatedSizes = product.sizes.map((s) =>
                                    s.size_id === size.size_id ? { ...s, price: newPrice } : s);
                                setProduct({ ...product, sizes: updatedSizes });
                            }}
                        />
                    );
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsProductEditModelOpened(false)} color="secondary">
                    İptal
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductEditModel;
