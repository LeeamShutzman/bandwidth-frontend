import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INDIGO } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BASE_URLS } from '../constants/config';

const AUTH_API_URL = `${BASE_URLS.auth}/login`;

const LoginScreen = () => {
    const { theme } = useTheme();
    const { login } = useAuth(); // Now this will work!
    const insets = useSafeAreaInsets();
    const passwordRef = useRef(null); // Ref to focus password field

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }
        
        setError(null);
        setLoading(true);
        Keyboard.dismiss(); // Close keyboard on press

        try {
            const response = await axios.post(AUTH_API_URL, {
                username: username,
                password: password,
            });

            if (response.data.jwtToken) {
                await login(response.data.jwtToken);
            } else {
                setError('Login failed: Invalid response from server.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message 
                ? err.response.data.message 
                : 'Authentication failed. Check credentials or server connection.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* 1. Sibling Background: Catches clicks outside inputs without stealing focus */}
            <Pressable 
                style={StyleSheet.absoluteFill} 
                onPress={Keyboard.dismiss} 
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={[styles.formCard, { paddingTop: insets.top > 0 ? 20 : 30 }]}>
                    <Text style={[styles.title, { color: INDIGO }]}>Task Manager</Text>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>🚨 {error}</Text>
                        </View>
                    )}

                    <TextInput
                        style={[styles.input, { borderColor: theme.border, color: theme.loginText, backgroundColor: theme.inputBackground }]}
                        placeholder="Username"
                        placeholderTextColor={theme.placeholder}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()} // Move to password
                        blurOnSubmit={false}
                    />

                    <TextInput
                        ref={passwordRef} // Attached ref here
                        style={[styles.input, { borderColor: theme.border, color: theme.loginText, backgroundColor: theme.inputBackground }]}
                        placeholder="Password"
                        placeholderTextColor={theme.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        returnKeyType="go"
                        onSubmitEditing={handleLogin}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: INDIGO }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>LOG IN</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formCard: {
        width: '85%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 16,
        backgroundColor: 'white',
        // Shadow for iOS/Web
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        // Shadow for Android
        elevation: 8,
        zIndex: 2, // Ensure card is above background
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    errorContainer: {
        padding: 12,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        color: '#991b1b',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default LoginScreen;