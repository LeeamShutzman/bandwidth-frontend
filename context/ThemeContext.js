import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { LIGHT_THEME, NIGHT_THEME } from '../constants/colors';

const ThemeContext = createContext();

const THEME_KEY = 'user-theme-preference';

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // Get the phone/browser system setting
  const [themeName, setThemeName] = useState('light'); // Default to light

  // --- 1. Load Theme on Startup ---
  useEffect(() => {
    const loadTheme = async () => {
      try {
        let savedTheme = null;
        
        if (Platform.OS === 'web') {
          savedTheme = localStorage.getItem(THEME_KEY);
        } else {
          savedTheme = await AsyncStorage.getItem(THEME_KEY);
        }

        // If user has a saved preference, use it. 
        // Otherwise, fall back to the system setting (dark/light).
        if (savedTheme) {
          setThemeName(savedTheme);
        } else if (systemColorScheme) {
          setThemeName(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // --- 2. Toggle and Save Theme ---
  const toggleTheme = async () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newTheme);

    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(THEME_KEY, newTheme);
      } else {
        await AsyncStorage.setItem(THEME_KEY, newTheme);
      }
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const isNightMode = themeName === 'dark';
  const theme = isNightMode ? NIGHT_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme, isNightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);