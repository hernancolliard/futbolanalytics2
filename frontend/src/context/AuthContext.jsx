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
        try {
            const response = await api.login(credentials);
            const { access_token } = response.data;
            console.log("Access Token received:", access_token); // Debugging line
            localStorage.setItem('token', access_token);
            setToken(access_token);
            const decoded = jwtDecode(access_token);
            setUser(decoded);
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw to propagate the error for UI feedback
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.register(userData);
            // Assuming successful registration implies user can log in immediately
            // The login function now handles its own errors
            await login({ email: userData.email, password: userData.password });
        } catch (error) {
            console.error("Registration failed:", error);
            throw error; // Re-throw to propagate the error for UI feedback
            // Optionally, set an error state to display to the user
        }
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
