import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState, createContext, useEffect } from 'react';
import axios from '@/app/lib/axios';
import { useAppContext } from './appContext';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const { state, setState } = useAppContext();

    const login = async ({ username, password }, navigate) => {
        setState({...state, loading: true});
        await axios.post('/auth/login', { username, password })
            .then(response => {
                if (response.status === 200) {
                    Cookies.set('token', response.data.token);
                    setUser(response.data.user);

                    if (navigate) {
                        router.push(navigate);
                    }

                }
            }).catch(error => {
                console.error(error);
            }).finally(() => {
                setState({...state, loading: false});
            });
    };

    const register = ({ username, password, role }) => {
        axios.post('/auth/register', { username, password, role })
            .then(response => {
                if (response.status === 200) {
                    // Cookies.set('token', response.data.token);
                    // setUser(response.data.data);
                }
            }).catch(error => {
                console.error(error);
            });
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
    };

    useEffect(() => {
        const token = Cookies.get('token');

        if (!user && token) {
            setState({...state, loading: true});
            axios.post('/auth/user', { token }).then(response => {
                if (response.status === 200) {
                    setUser(response.data.data);
                }
            }).finally(() => {
                setState({...state, loading: false});
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
