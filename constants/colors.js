// constants/colors.js

// Primary Colors based on Tailwind 500/900 palette
export const INDIGO = '#4f46e5'; // Indigo-600 for primary buttons/headers

export const PRIORITY_STYLES = {
  LOW: { 
    cardBg: '#d9f99d', // Green-200
    text: '#16a34a', // Green-600
    border: '#14532d', // Green-900 
  },
  MEDIUM: { 
    cardBg: '#fef08a', // Yellow-200
    text: '#a16207', // Yellow-700
    border: '#4c2d0f', // Yellow-900 
  },
  HIGH: { 
    cardBg: '#fecaca', // Red-200
    text: '#dc2626', // Red-600
    border: '#7f1d1d', // Red-900 
  },
};

export const LIGHT_THEME = {
  background: '#f3f4f6', // Gray-100
  text: '#1f2937', // Gray-900
  loginText: '#000000', //Black
  placeHolder: '#999999',
  headerBackground: '#ffffff', // White
  cardBackground: '#ffffff', // White
  inputBackground: '#f9fafb', // Gray-50
  primaryButton: INDIGO,
};

export const NIGHT_THEME = {
  background: '#1f2937', // Gray-900
  text: '#f3f4f6', // Gray-100,
  loginText: '#000000', //Black
  placeholder: '#888888',
  headerBackground: '#000000', // Black
  cardBackground: '#374151', // Gray-700
  inputBackground: '#4b5563', // Gray-600
  primaryButton: INDIGO,
};