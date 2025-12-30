import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUserInfo({ token }); // This logs the user in
        } catch (e) {
            console.error("Login save error:", e);
        }
    };

    // --- 1. THE LOGOUT FUNCTION ---
    // Clears everything: Storage, Axios Headers, and App State
    const logout = async () => {
        try {
            console.log("Starting logout process...");
            await AsyncStorage.removeItem('userToken');
            
            // Remove the token from all future Axios requests
            delete axios.defaults.headers.common['Authorization'];
            
            // Setting this to null triggers the navigation switch in App.js
            setUserInfo(null);
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    // --- 2. STARTUP CHECK ---
    // Runs once when the app opens to see if we have a saved token
    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    console.log("Token found, restoring session...");
                    setUserInfo({ token });
                    // Set the header so existing token is used for the first fetch
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Failed to load token from storage:", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStorageData();
    }, []);

    // --- 3. THE 401 INTERCEPTOR ---
    // Listens to every response. If the server says 401 (Unauthorized), we logout.
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response, // If request is successful, do nothing
            async (error) => {
                // If the error status is 401, the token is likely expired or invalid
                if (error.response && error.response.status === 401) {
                    console.warn("Unauthorized! Session expired.");
                    await logout(); 
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount to prevent memory leaks
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider value={{ 
            userInfo, 
            setUserInfo, 
            isLoading, 
            logout,
            login
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easier usage in other components
export const useAuth = () => useContext(AuthContext);