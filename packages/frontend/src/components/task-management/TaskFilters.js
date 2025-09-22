import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const TaskFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  taskCounts = {}
}) => {
  const handleFilterChange = (filterType) => (event) => {
    onFilterChange(filterType, event.target.value);
  };

  const handleSearchChange = (event) => {
    onFilterChange('search', event.target.value);
  };

  const hasActiveFilters = filters.status || filters.priority || filters.dueDateRange || filters.search;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 2
      }}>
        {/* Search */}
        <TextField
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { sm: 250 } }}
        />

        {/* Status Filter */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={handleFilterChange('status')}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Not Started">
              Not Started 
              {taskCounts['Not Started'] && (
                <Chip 
                  label={taskCounts['Not Started']} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              )}
            </MenuItem>
            <MenuItem value="In Progress">
              In Progress
              {taskCounts['In Progress'] && (
                <Chip 
                  label={taskCounts['In Progress']} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              )}
            </MenuItem>
            <MenuItem value="Completed">
              Completed
              {taskCounts['Completed'] && (
                <Chip 
                  label={taskCounts['Completed']} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              )}
            </MenuItem>
          </Select>
        </FormControl>

        {/* Priority Filter */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority || ''}
            label="Priority"
            onChange={handleFilterChange('priority')}
          >
            <MenuItem value="">All Priority</MenuItem>
            <MenuItem value="High">
              High
              {taskCounts['High'] && (
                <Chip 
                  label={taskCounts['High']} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              )}
            </MenuItem>
            <MenuItem value="Medium">
              Medium
              {taskCounts['Medium'] && (
                <Chip 
                  label={taskCounts['Medium']} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              )}
            </MenuItem>
            <MenuItem value="Low">
              Low
              {taskCounts['Low'] && (
                <Chip 
                  label={taskCounts['Low']} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              )}
            </MenuItem>
          </Select>
        </FormControl>

        {/* Due Date Filter */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel>Due Date</InputLabel>
          <Select
            value={filters.dueDateRange || ''}
            label="Due Date"
            onChange={handleFilterChange('dueDateRange')}
          >
            <MenuItem value="">All Dates</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="today">Due Today</MenuItem>
            <MenuItem value="this-week">This Week</MenuItem>
            <MenuItem value="this-month">This Month</MenuItem>
            <MenuItem value="no-due-date">No Due Date</MenuItem>
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'createdAt'}
            label="Sort By"
            onChange={handleFilterChange('sortBy')}
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="lastModified">Last Modified</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Order */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={filters.sortOrder || 'desc'}
            label="Order"
            onChange={handleFilterChange('sortOrder')}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          flexWrap: 'wrap',
          pt: 1,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="body2" color="text.secondary">
            Active filters:
          </Typography>
          
          {filters.search && (
            <Chip
              label={`Search: "${filters.search}"`}
              size="small"
              onDelete={() => onFilterChange('search', '')}
              deleteIcon={<ClearIcon />}
            />
          )}
          
          {filters.status && (
            <Chip
              label={`Status: ${filters.status}`}
              size="small"
              onDelete={() => onFilterChange('status', '')}
              deleteIcon={<ClearIcon />}
            />
          )}
          
          {filters.priority && (
            <Chip
              label={`Priority: ${filters.priority}`}
              size="small"
              onDelete={() => onFilterChange('priority', '')}
              deleteIcon={<ClearIcon />}
            />
          )}
          
          {filters.dueDateRange && (
            <Chip
              label={`Due: ${filters.dueDateRange.replace('-', ' ')}`}
              size="small"
              onDelete={() => onFilterChange('dueDateRange', '')}
              deleteIcon={<ClearIcon />}
            />
          )}

          <Chip
            label="Clear All"
            size="small"
            onClick={onClearFilters}
            variant="outlined"
            deleteIcon={<ClearIcon />}
            onDelete={onClearFilters}
          />
        </Box>
      )}
    </Box>
  );
};

TaskFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    dueDateRange: PropTypes.string,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  taskCounts: PropTypes.object,
};

export default TaskFilters;