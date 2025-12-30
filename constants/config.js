import { Platform } from 'react-native';

// Use your domain name now that SSL is active!
const DOMAIN = 'bandwidth.ddns.net'; 

export const BASE_URLS = {
    // We remove the specific /api/... suffix here to make it cleaner in the screens
    auth: Platform.OS === 'web' ? '/api/v1/auth' : `https://${DOMAIN}/api/v1/auth`,
    tasks: Platform.OS === 'web' ? '/api/v1/tasks' : `https://${DOMAIN}/api/v1/tasks`,
    user: Platform.OS === 'web' ? '/api/v1/users' : `https://${DOMAIN}/api/v1/users`,
};