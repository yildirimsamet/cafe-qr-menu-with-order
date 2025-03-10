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
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from '@/app/lib/axios';
import styles from './styles.module.scss';

const EditUserModal = ({mutate, selectedUserForEdit, isUserEditModelOpened, setIsUserEditModelOpened }) => {
    const [user, setUser] = useState({
        ...selectedUserForEdit,
        password: '',
        role: selectedUserForEdit.role === 'superadmin' ? 'superadmin' : selectedUserForEdit.role,
    });

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
            const { data } = await axios.put(`/auth/update/${selectedUserForEdit.id}`, user);

            if (data.status === 200 && data.data) {
                mutate();

                Swal.fire({
                    icon: 'success',
                    title: 'Kullanıcı Başarıyla Düzenlendi',
                    text: 'Kullanıcı Düzenlendi',
                }).then(() => {
                    setIsUserEditModelOpened(false);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: res.error || 'Kullanıcı düzenlenemedi.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.error || 'Kullanıcı düzenlenemedi.',
            });

            setIsUserEditModelOpened(false);
        }
    };

    const checkErrors = () => {
        if (!user.username) {
            return 'Kullanıcı adı bos birakilamaz';
        }

        if (!user.role) {
            return 'Rol bos birakilamaz';
        }

        return false;
    };

    return (
        <Dialog
            closeAfterTransition={false}
            open={isUserEditModelOpened}
            onClose={() => setIsUserEditModelOpened(false)}
            fullWidth
            maxWidth="sm"
            slotProps={{ backdrop: { invisible: true } }}
        >
            <DialogTitle>
                Kullanıcı Güncelle
                <IconButton
                    onClick={() => setIsUserEditModelOpened(false)}
                    style={{ position: 'absolute', right: 10, top: 10 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Kullanıcı Adı"
                    variant="outlined"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    fullWidth
                    margin="dense"
                    value={user?.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
                <TextField
                    label="Yeni Parola Belirle (Boş bırakılabilir, eski parola kullanılacak)"
                    type="password"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    fullWidth
                    margin="dense"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                {
                    user?.role !== 'superadmin' && (
                        <FormControl
                            fullWidth
                            margin="dense"
                        >
                            <InputLabel>Kullanıcı Rolü</InputLabel>
                            <Select
                                label="Rol"
                                slotProps={{
                            inputLabel: {
                                shrink: false,
                            },
                        }}
                                value={user?.role}
                                onChange={(e) => setUser({ ...user, role: e.target.value })}
                            >
                                <MenuItem value='admin'>
                                    Admin
                                </MenuItem>
                                <MenuItem value='waiter'>
                                    Garson
                                </MenuItem>
                            </Select>
                        </FormControl>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button
                    className={styles.cancelButton}
                    onClick={() => setIsUserEditModelOpened(false)}
                    color="secondary"
                >
                    İptal
                </Button>
                <Button
                    className={styles.saveButton}
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                >
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserModal;
