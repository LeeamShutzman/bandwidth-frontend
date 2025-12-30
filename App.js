import React, { useState } from 'react'; // Added useState
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Local Imports
import Header from './components/Header';
import { INDIGO } from './constants/colors';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen'; 
import SignUpScreen from './screens/SignUpScreen'; // 1. IMPORT THE NEW SCREEN
import TaskGrid from './screens/TaskGrid'; 

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AuthRouter /> 
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const AuthRouter = () => {
    const { userInfo, isLoading } = useAuth(); 
    
    // 2. STATE TO TOGGLE BETWEEN LOGIN AND SIGNUP
    const [isSigningUp, setIsSigningUp] = useState(false);
    
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={INDIGO} />
            </View>
        );
    }
    
    // 3. LOGIC FOR UNAUTHENTICATED USERS
    if (!userInfo) {
        return (
            <>
                <Header /> 
                {isSigningUp ? (
                    // Show Sign Up and provide a way to go back
                    <SignUpScreen onBackToLogin={() => setIsSigningUp(false)} />
                ) : (
                    // Show Login and provide a way to switch to Sign Up
                    <LoginScreen onShowSignUp={() => setIsSigningUp(true)} />
                )}
            </>
        );
    }
    
    // If userInfo exists, render TaskGrid
    return (
        <>
            <Header />
            <TaskGrid />
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});