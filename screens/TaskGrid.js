import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator, Dimensions, FlatList,
    Keyboard,
    Platform, StyleSheet, Text, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local Imports
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { INDIGO } from '../constants/colors';
import { useAuth } from '../context/AuthContext'; // <-- NEW: Import Auth context
import { useTheme } from '../context/ThemeContext';
import { BASE_URLS } from '../constants/config';

const API_BASE_URL = `${BASE_URLS.tasks}`;

// --- API Retry Helper (Using global axios) ---
const retryAxios = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios({ url, ...options });
            return response;
        } catch (error) {
            console.error(`Axios failed (attempt ${i + 1}/${retries}):`, error.message);
            // STOP RETRYING if it's an auth error
            if (error.response?.status === 401) {
                throw error; 
            }

            if (i === retries - 1) throw error;
            
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};


const TaskGrid = () => {
    const { theme } = useTheme();
    const { logout } = useAuth(); // <-- NEW: Get the logout function
    const insets = useSafeAreaInsets();

    // *** MOCK_USER_ID is a temporary placeholder. *** // Once the Task Service is secure, it will extract the user ID from the JWT.
    const MOCK_USER_ID = 3;

    const [tasks, setTasks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- API Functions ---
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // NOTE: This URL should eventually change to fetch tasks for the logged-in user 
            // without relying on MOCK_USER_ID, once the Task Service is updated.
            const url = `${API_BASE_URL}/user`;
            const response = await retryAxios(url, { method: 'GET' });
            setTasks(response.data.filter(t => !t.completed));
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            // If 401/403, the JWT failed. Display error and maybe prompt logout.
            setError(`Could not load tasks. Authentication may be required.`);
        } finally {
            setLoading(false);
        }
    }, [logout]);

    // --- Create/Update/Delete functions (unchanged, still use retryAxios) ---
    const createTask = async (text, priority) => {
        setError(null);
        try {
            const payload = {
                text: text,
                priority: priority,
            };
            await retryAxios(API_BASE_URL, {
                method: 'POST',
                data: payload,
            });
            await fetchTasks();
            setIsModalVisible(false);
        } catch (err) {
            console.error('Failed to create task:', err);
            setError(`Failed to create task: ${err.message}`);
        }
    };

    const updateTask = async (taskId, text, priority, completedStatus = undefined) => {
        setError(null);
        try {
            const payload = { text: text, priority: priority };
            if (completedStatus !== undefined) {
                payload.completed = completedStatus;
            }

            const url = `${API_BASE_URL}/${taskId}`;
            await retryAxios(url, { method: 'PUT', data: payload });
            await fetchTasks();
            setSelectedTask(null);
            setIsModalVisible(false);
        } catch (err) {
            console.error('Failed to update task:', err);
            setError(`Failed to update task: ${err.message}`);
        }
    };

    const deleteTask = async (taskId) => {
        setError(null);
        try {
            const url = `${API_BASE_URL}/${taskId}`;
            await retryAxios(url, { method: 'DELETE' });

            // Optimistic update
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            setSelectedTask(null);
            setIsModalVisible(false);
        } catch (err) {
            console.error('Failed to delete task:', err);
            if (err.response?.status !== 404) {
                setError(`Failed to delete task: ${err.message}`);
            }
            setSelectedTask(null);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // --- Rendering Helpers ---
    const handleSelectTask = (task) => {
        setSelectedTask(task);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setIsModalVisible(false);
    };

    const windowWidth = Dimensions.get('window').width;
    const numColumns = useMemo(() => {
        if (windowWidth > 1024) return 3;
        if (windowWidth > 640) return 2;
        return 1;
    }, [windowWidth]);


    if (loading && tasks.length === 0) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={INDIGO} />
                <Text style={{ color: theme.text, marginTop: 10 }}>Loading Tasks...</Text>
            </View>
        );
    }

    const activeTasks = tasks.filter(t => !t.completed);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={logout}
                    style={[styles.logoutButton, { backgroundColor: theme.primaryButton + 'cc' }]}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                {/* End Logout Button */}

                {/* Main Content Area */}
                <View style={[styles.mainContent, { paddingBottom: insets.bottom + 80 }]}>
                    <Text style={[styles.title, { color: theme.text }]}>My Active Tasks</Text>

                    {/* Error Message */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>🚨 {error}</Text>
                        </View>
                    )}

                    {/* Empty State */}
                    {!loading && activeTasks.length === 0 && !error && (
                        <View style={[styles.emptyState, { borderColor: theme.text + '30' }]}>
                            <Text style={[styles.emptyText, { color: theme.text }]}>No active tasks yet! Click the '+' button to add one.</Text>
                        </View>
                    )}

                    {/* Task Grid */}
                    <View style={styles.gridWrapper}>
                        <FlatList
                            data={activeTasks}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={numColumns}
                            key={numColumns}
                            columnWrapperStyle={numColumns > 1 ? styles.row : null}
                            renderItem={({ item }) => (
                                <View style={{ width: numColumns === 1 ? '100%' : `${100 / numColumns}%` }}>
                                    <TaskCard
                                        task={item}
                                        onSelectTask={handleSelectTask}
                                    />
                                </View>
                            )}
                            contentContainerStyle={activeTasks.length > 0 ? styles.listContent : null}
                        />
                    </View>
                </View>

                {/* Floating Action Button */}
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={[styles.addButton, { backgroundColor: theme.primaryButton, bottom: 20 + insets.bottom }]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>

                {/* Modals */}
                <TaskForm
                    isVisible={isModalVisible}
                    onClose={handleCloseModal}
                    initialTask={selectedTask}
                    onSave={(text, priority, completed) => {
                        if (selectedTask) {
                            const newCompleted = completed !== undefined ? completed : selectedTask.completed;
                            updateTask(selectedTask.id, text, priority, newCompleted);
                        } else {
                            createTask(text, priority);
                        }
                    }}
                    onDelete={deleteTask}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

// Export the component as default
export default TaskGrid;

// --- Styles (Existing styles moved to the file) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        right: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        zIndex: 10,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        width: '100%',
        alignSelf: 'center',
        maxWidth: 896,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
    },
    errorContainer: {
        padding: 12,
        backgroundColor: '#fecaca',
        borderWidth: 1,
        borderColor: '#ef4444',
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#b91c1c',
        fontWeight: 'bold',
    },
    emptyState: {
        padding: 40,
        borderWidth: 4,
        borderStyle: 'dashed',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
    gridWrapper: {
        flex: 1,
    },
    listContent: {
        justifyContent: 'center',
        paddingHorizontal: 0,
    },
    row: {
        justifyContent: 'flex-start',
        marginHorizontal: -8,
    },
    addButton: {
        position: 'absolute',
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 30,
        lineHeight: 30,
        fontWeight: 'bold',
        marginTop: Platform.OS === 'ios' ? -2 : 0,
    },
}
);