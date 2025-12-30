import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Keyboard } from 'react-native';
import { INDIGO } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { BASE_URLS } from '../constants/config';

const SIGNUP_API_URL = BASE_URLS.user;

const SignUpScreen = ({ onBackToLogin }) => {
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignUp = async () => {
        if (!username || !email || !password) {
            setError("All fields are required.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(SIGNUP_API_URL, { username, email, password });
            alert("Account created! Please log in.");
            onBackToLogin(); 
        } catch (err) {
            setError(err.response?.data || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <View style={styles.formCard}>
                    <Text style={[styles.title, { color: INDIGO }]}>Join Bandwidth</Text>
                    
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TextInput 
                        style={[styles.input, {borderColor: theme.border, backgroundColor: theme.inputBackground}]} 
                        placeholder="Username" 
                        onChangeText={setUsername} 
                        autoCapitalize="none"
                    />
                    <TextInput 
                        style={[styles.input, {borderColor: theme.border, backgroundColor: theme.inputBackground}]} 
                        placeholder="Email" 
                        onChangeText={setEmail} 
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput 
                        style={[styles.input, {borderColor: theme.border, backgroundColor: theme.inputBackground}]} 
                        placeholder="Password" 
                        secureTextEntry 
                        onChangeText={setPassword} 
                    />

                    <TouchableOpacity style={[styles.button, { backgroundColor: INDIGO }]} onPress={handleSignUp} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>CREATE ACCOUNT</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onBackToLogin} style={{ marginTop: 20 }}>
                        <Text style={{ textAlign: 'center', color: INDIGO }}>Already have an account? Log In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

// ... Reuse styles from LoginScreen or import them ...
const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    formCard: { width: '85%', padding: 30, borderRadius: 16, backgroundColor: 'white', elevation: 8 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
    button: { height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    errorText: { color: 'red', textAlign: 'center', marginBottom: 10 }
});

export default SignUpScreen;