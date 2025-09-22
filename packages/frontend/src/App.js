import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Fab,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';

import auroraTheme from './theme/auroraTheme';
import { useTaskManager } from './hooks/useTaskManager';
import { useTaskFilters } from './hooks/useTaskFilters';
import { TaskList, TaskForm, TaskFilters } from './components/task-management';

function App() {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    clearError,
  } = useTaskManager();

  const {
    filters,
    filteredTasks,
    taskCounts,
    handleFilterChange,
    clearFilters,
  } = useTaskFilters(tasks);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const isMobile = useMediaQuery(auroraTheme.breakpoints.down('sm'));

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        showSnackbar('Task updated successfully!');
      } else {
        await createTask(taskData);
        showSnackbar('Task created successfully!');
      }
      setFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      showSnackbar(err.message || 'An error occurred', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      showSnackbar('Task deleted successfully!');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      showSnackbar(`Task status updated to ${status}!`);
    } catch (err) {
      showSnackbar(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const notStartedTasks = tasks.filter(task => task.status === 'Not Started').length;

  return (
    <ThemeProvider theme={auroraTheme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Aurora Task Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalTasks} task{totalTasks !== 1 ? 's' : ''}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {completedTasks}
                    </Typography>
                    <Typography color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlayArrowIcon color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {inProgressTasks}
                    </Typography>
                    <Typography color="text.secondary">
                      In Progress
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {notStartedTasks}
                    </Typography>
                    <Typography color="text.secondary">
                      Not Started
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Typography variant="h6" color="primary.contrastText">
                      {totalTasks}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      Total
                    </Typography>
                    <Typography color="text.secondary">
                      All Tasks
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          taskCounts={taskCounts}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add task"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          onClick={handleCreateTask}
        >
          <AddIcon />
        </Fab>

        {/* Task Form Dialog */}
        <TaskForm
          open={formOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          task={editingTask}
          loading={loading}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;