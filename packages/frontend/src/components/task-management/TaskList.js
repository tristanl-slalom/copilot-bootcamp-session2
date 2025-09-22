import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import TaskCard from './TaskCard';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = null,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  emptyMessage = "No tasks found. Create your first task to get started!"
}) => {
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        py: 8 
      }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} />
          <Typography color="text.secondary">
            Loading tasks...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
      >
        {error}
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <CheckCircleIcon 
          sx={{ 
            fontSize: 48, 
            color: 'text.disabled',
            mb: 2 
          }} 
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Tasks will appear here once you create them.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Task Statistics */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Task Cards */}
      <Stack spacing={2}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
          />
        ))}
      </Stack>
    </Box>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
      priority: PropTypes.oneOf(['High', 'Medium', 'Low']),
      status: PropTypes.oneOf(['Not Started', 'In Progress', 'Completed']),
      createdAt: PropTypes.string,
      lastModified: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
};

export default TaskList;