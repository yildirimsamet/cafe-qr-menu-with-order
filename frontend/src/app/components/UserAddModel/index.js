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

const UserAddModel = ({mutate, isUserAddModelOpened, setIsUserAddModelOpened }) => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        role: '',
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
            const response = await axios.post('/auth/register', user);

            if (response.data.data) {
                mutate();

                Swal.fire({
                    icon: 'success',
                    title: 'Kullanıcı Başarıyla Eklendi',
                    text: response.data.name,
                }).then(() => {
                    setIsUserAddModelOpened(false);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: 'Kullanıcı Eklemede Hata Olustu',
                });
            }
        } catch (error) {
            //
        }
    };

    const checkErrors = () => {
        if (!user.password) {
            return 'Parola bos birakilamaz';
        }

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
            open={isUserAddModelOpened}
            onClose={() => setIsUserAddModelOpened(false)}
            fullWidth
            maxWidth="sm"
            slotProps={{ backdrop: { invisible: true } }}
        >
            <DialogTitle>
                Kullanıcı Ekle
                <IconButton
                    onClick={() => setIsUserAddModelOpened(false)}
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
                    label="Parola"
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
                <FormControl
                    fullWidth
                    margin="dense"
                >
                    <InputLabel>Rol</InputLabel>
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
            </DialogContent>
            <DialogActions>
                <Button
                    className={styles.cancelButton}
                    onClick={() => setIsUserAddModelOpened(false)}
                    color="secondary"
                >
                    İptal
                </Button>
                <Button
                    className={styles.saveButton}
                    onClick={() => handleSave()}
                    color="primary"
                    variant="contained"
                >
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserAddModel;
