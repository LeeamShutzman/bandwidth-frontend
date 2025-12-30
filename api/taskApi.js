// api/taskApi.js

import axios from 'axios';
import { BASE_URLS } from '../constants/config';

// IMPORTANT: Replace with your actual base URL
const API_BASE_URL = `${BASE_URLS.tasks}`;

// Note: For simplicity and assuming a single user, we'll hardcode a userId
// In a real app, this would come from an authentication context.
const DUMMY_USER_ID = 1;

export const fetchTasks = async () => {
  try {
    // Uses the GET /api/v1/tasks/user/{userId} endpoint
    const response = await axios.get(`${API_BASE_URL}/user/${DUMMY_USER_ID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    // Uses the POST /api/v1/tasks endpoint
    const response = await axios.post(API_BASE_URL, {
      ...taskData,
      userId: DUMMY_USER_ID, // Add the required userId
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    // Uses the PUT /api/v1/tasks/{id} endpoint
    const response = await axios.put(`${API_BASE_URL}/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    // Uses the DELETE /api/v1/tasks/{id} endpoint
    await axios.delete(`${API_BASE_URL}/${taskId}`);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};