import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { format, isAfter, isBefore, isToday } from 'date-fns';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  className = '' 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    handleMenuClose();
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(task.id, newStatus);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'secondary';
      case 'not started':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'in progress':
        return <PlayArrowIcon />;
      case 'not started':
        return <PauseIcon />;
      default:
        return <PauseIcon />;
    }
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text.secondary';
    
    const due = new Date(dueDate);
    if (isToday(due)) return 'warning.main';
    if (isBefore(due, new Date())) return 'error.main';
    return 'text.secondary';
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    try {
      const due = new Date(dueDate);
      if (isToday(due)) return 'Due today';
      if (isBefore(due, new Date())) return `Overdue - ${format(due, 'MMM d, yyyy')}`;
      return `Due ${format(due, 'MMM d, yyyy')}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card 
      className={`task-card ${className}`}
      sx={{ 
        mb: 2,
        position: 'relative',
        '&:hover .task-actions': {
          opacity: 1,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, pr: 1 }}>
            {task.title}
          </Typography>
          <IconButton
            className="task-actions"
            size="small"
            onClick={handleMenuClick}
            sx={{ opacity: 0, transition: 'opacity 0.2s ease-in-out' }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {task.priority && (
            <Chip
              label={task.priority}
              size="small"
              color={getPriorityColor(task.priority)}
              variant="outlined"
            />
          )}
          
          <Chip
            icon={getStatusIcon(task.status)}
            label={task.status || 'Not Started'}
            size="small"
            color={getStatusColor(task.status)}
            clickable
            onClick={() => {
              const nextStatus = 
                task.status === 'Not Started' ? 'In Progress' :
                task.status === 'In Progress' ? 'Completed' :
                'Not Started';
              handleStatusChange(nextStatus);
            }}
          />
        </Box>

        {task.dueDate && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: getDueDateColor(task.dueDate),
              fontWeight: 500,
              display: 'block',
              mt: 1
            }}
          >
            {formatDueDate(task.dueDate)}
          </Typography>
        )}

        {task.createdAt && (
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
            Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </Typography>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 'small' }} />
          Edit Task
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 'small' }} />
          Delete Task
        </MenuItem>
      </Menu>
    </Card>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.oneOf(['High', 'Medium', 'Low']),
    status: PropTypes.oneOf(['Not Started', 'In Progress', 'Completed']),
    createdAt: PropTypes.string,
    lastModified: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default TaskCard;