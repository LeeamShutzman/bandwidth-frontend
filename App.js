import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Local Imports with UPDATED paths
import Header from './components/Header';
import { INDIGO } from './constants/colors';
import { AuthProvider, useAuth } from './context/AuthContext'; // <-- Path updated
import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen'; // <-- Path updated
import TaskGrid from './screens/TaskGrid'; // <-- Path updated

// Main App component wrapped in providers
export default function App() {
  return (
    <SafeAreaProvider>
      {/* 1. ThemeProvider provides the styling context */}
      <ThemeProvider>
        {/* 2. AuthProvider provides the login state and JWT handling context */}
        <AuthProvider>
          <AuthRouter /> 
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
const AuthRouter = () => {
    // CHANGE THIS: Destructure userInfo, not token
    const { userInfo, isLoading } = useAuth(); 
    
    // Show a full-screen loading spinner
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={INDIGO} />
            </View>
        );
    }
    
    // CHANGE THIS: Check if userInfo is null
    if (!userInfo) {
        return (
            <>
                <Header /> 
                <LoginScreen />
            </>
        );
    }
    
    // If userInfo exists (meaning login was successful), render TaskGrid
    return (
        <>
            <Header />
            <TaskGrid />
        </>
    );
};

// Styles for the loading state
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});