import { Platform } from 'react-native';

// Replace with your EC2 Public IP or Domain Name
const DEV_IP = '3.134.96.64'; 

export const BASE_URLS = {
    auth: Platform.OS === 'web' ? '/api/v1/auth' : `http://${DEV_IP}/api/v1/auth`,
    tasks: Platform.OS === 'web' ? '/api/v1/tasks' : `http://${DEV_IP}/api/v1/tasks`,
    user: Platform.OS === 'web' ? '/api/v1/user' : `http://${DEV_IP}/api/v1/user`,
};