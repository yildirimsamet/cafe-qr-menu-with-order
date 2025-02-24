import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

const RegisterForm = () => {
    const { register } = useAuth({});
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            register(formData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
                <Typography variant="h5" align="center" gutterBottom>
                    Kayıt Ol
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
                    <TextField
                        fullWidth
                        label="Rol"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Kayıt Ol
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default RegisterForm;
