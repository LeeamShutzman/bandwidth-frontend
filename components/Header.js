import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  // isNightMode now correctly extracted from the context!
  const { theme, isNightMode, toggleTheme } = useTheme(); 

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Bandwidth</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
          <Text style={[styles.toggleText, { color: theme.text }]}>
            {/* The ternary condition will now work correctly */}
            {isNightMode ? '☀️ Light Mode' : '🌙 Night Mode'} 
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 5,
    borderRadius: 5,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Header;