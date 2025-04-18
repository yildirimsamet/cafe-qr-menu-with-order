'use client';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from '@/app/lib/axios';
import EditUserModal from '../components/Edit/EditUserModal';
import UserAddModel from '../components/UserAddModel';
import { useAuthorization } from '../hooks/useAuthorization';
import useNotification from '../hooks/useNotification';
import styles from './styles.module.scss';

const Users = () => {
    useNotification();
    const { user: loggedInUser } = useAuthorization({ authorization: 'admin', redirectUrl: '/login' });

    const [users, setUsers] = useState([]);
    const [isUserEditModelOpened, setIsUserEditModelOpened] = useState(false);
    const [isUserAddModelOpened,  setIsUserAddModelOpened] = useState(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

    const getUsers = async () => {
        try {
            const res = await axios.get('/users');
            setUsers(res.data.data);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleDelete = async (user) => {
        try {
            if (user.role === 'superadmin') {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: 'Superadmin silinemez.',
                });
                return;
            } else if (user.role === 'admin' && loggedInUser.role == 'admin') {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: 'Bir admin, admin silinemez.',
                });
                return;
            }
            Swal.fire({
                title: 'Silmek istediginizden emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Evet',
                cancelButtonText: 'Hayır',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`/auth/delete/${user.id}`)
                        .then((res) => {
                            if (res.status === 200 && res.data) {
                                getUsers();
                                Swal.fire('Silindi', 'Kullanıcı başarıyla silindi.', 'success');
                            } else {
                                Swal.fire('Hata', 'Kullanıcı silinemedi.', 'error');
                            }
                        })
                        .catch(() => {
                            Swal.fire('Hata', 'Kullanıcı silinemedi.', 'error');
                        });
                }
            }).catch(() => {
                Swal.fire('Hata', 'Kullanıcı silinemedi.', 'error');
            });
        } catch (error) {
            Swal.fire('Hata', 'Kullanıcı silinemedi.', 'error');
        }
    };

    const handleUpdate = async (user) => {
        if (user.role === 'admin' && loggedInUser.role == 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Bir admin, admini güncelleyemez.',
            });
            return;
        }

        setSelectedUserForEdit(user);
        setIsUserEditModelOpened(true);
    };

    return (
        <div>
            <div className={styles.title}>
                Kullanıcılar
            </div>
            <div className='container'>
                <div className={styles.topButtons}>
                    <button
                        className={styles.topButtonsAdd}
                        onClick={() => {
                        setIsUserAddModelOpened(true);
                    }}
                    >
                        Kullanıcı Ekle
                        <AddCircleIcon />
                    </button>
                </div>
                <TableContainer component={Paper}>
                    <Table
                        sx={{ minWidth: 650 }}
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Kullanıcı Adı</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell sx={{ width: '250px' }}>Düzenle</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        {user.id}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role && user.role === 'waiter' ? 'Garson' : user.role}</TableCell>
                                    <TableCell sx={{ width: '250px' }}>
                                        <div className={styles.buttons}>
                                            <button
                                                className={styles.buttonsEdit}
                                                onClick={() => {
                                            handleUpdate(user);
                                        }}
                                            >Güncelle</button>
                                            <button
                                                className={styles.buttonsDelete}
                                                onClick={() => {
                                            handleDelete(user);
                                        }}
                                            >Sil</button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {
                isUserEditModelOpened && (
                    <EditUserModal
                        mutate={getUsers}
                        selectedUserForEdit={selectedUserForEdit}
                        isUserEditModelOpened={isUserEditModelOpened}
                        setIsUserEditModelOpened={setIsUserEditModelOpened}
                    />
                )
            }
            {
                isUserAddModelOpened && (
                    <UserAddModel
                        mutate={getUsers}
                        isUserAddModelOpened={isUserAddModelOpened}
                        setIsUserAddModelOpened={setIsUserAddModelOpened}
                    />
                )
            }
        </div>
    );
};

export default Users;
