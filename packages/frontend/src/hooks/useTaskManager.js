import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

// Custom hook for API operations
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (apiFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, apiCall, setError };
};

// Task API functions
const taskAPI = {
  async fetchTasks() {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
  },

  async updateTask(taskId, updates) {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updates);
    return response.data;
  },

  async deleteTask(taskId) {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
  },
};

// Main task management hook
export const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const { loading, error, apiCall, setError } = useApi();

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const fetchedTasks = await apiCall(() => taskAPI.fetchTasks());
      setTasks(fetchedTasks || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  }, [apiCall]);

  const createTask = useCallback(async (taskData) => {
    try {
      const newTask = await apiCall(() => taskAPI.createTask(taskData));
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  }, [apiCall]);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const updatedTask = await apiCall(() => taskAPI.updateTask(taskId, updates));
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
      return updatedTask;
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  }, [apiCall]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await apiCall(() => taskAPI.deleteTask(taskId));
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  }, [apiCall]);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    return updateTask(taskId, { status });
  }, [updateTask]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refreshTasks: loadTasks,
    clearError: () => setError(null),
  };
};