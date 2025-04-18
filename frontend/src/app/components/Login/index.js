import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import  useCustomRouter  from '@/app/hooks/useCustomRouter';
import styles from './styles.module.scss';

const LoginForm = () => {
    const router = useCustomRouter();
    const { login, user } = useAuth({});
    const [formData, setFormData] = useState({
        username: 'superadmin',
        password: 'superadmin',
    });

    useEffect(() => {
        if (user) {
            router.push('/tables');
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            login(formData, '/tables');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.loginForm}>
            <Typography
                className={styles.loginFormTitle}
                variant="h4"
                align="center"
                gutterBottom
            >
                Giriş Paneli
            </Typography>
            <Container maxWidth="sm">
                <Box
                    mt={5}
                    p={4}
                    boxShadow={3}
                    borderRadius={2}
                    bgcolor="white"
                >
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                    >
                        Giriş
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Kullanıcı Adı"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Parola"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button
                            className={styles.loginButton}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Giriş Yap
                        </Button>
                    </form>
                </Box>
            </Container>
        </div>
    );
};

export default LoginForm;
