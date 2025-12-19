import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

// Decodificador JWT ligero para evitar problemas de build con la
// dependencia `jwt-decode` en entornos ESM/rollup. Devuelve el payload
// decodificado o null si no es un JWT válido.
function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    let json;
    if (typeof atob === 'function') {
      const decoded = atob(payload);
      json = decodeURIComponent(decoded.split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } else if (typeof Buffer !== 'undefined') {
      json = Buffer.from(payload, 'base64').toString('utf8');
    } else {
      return null;
    }
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token && token.split(".").length === 3) {
      try {
        const decoded = decodeJwt(token);
        if (decoded) setUser(decoded);
        else throw new Error('Invalid token payload');
      } catch (error) {
        console.error("Error decoding token from localStorage:", error);
        // If token is invalid, clear it
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } else if (token) {
      console.error(
        "Invalid token format found in localStorage. Clearing token."
      );
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      setToken(access_token);
      if (access_token && access_token.split(".").length === 3) {
        const decoded = decodeJwt(access_token);
        if (decoded) setUser(decoded);
        else {
          console.error("Invalid access_token payload received from API. Clearing token.");
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          throw new Error("Invalid token received from server.");
        }
      } else {
        console.error(
          "Invalid access_token format received from API. Clearing token."
        );
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        throw new Error("Invalid token received from server.");
      }
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
    localStorage.removeItem("token");
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
