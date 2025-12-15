import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await api.login(credentials);
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        const decoded = jwtDecode(access_token);
        setUser(decoded);
    };

    const register = async (userData) => {
        await api.register(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
