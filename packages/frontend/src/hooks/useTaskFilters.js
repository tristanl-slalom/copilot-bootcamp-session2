import { useState, useMemo, useCallback } from 'react';
import { 
  isAfter, 
  isBefore, 
  isToday, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  parseISO 
} from 'date-fns';

export const useTaskFilters = (tasks = []) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    dueDateRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      dueDateRange: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  // Filter tasks based on active filters
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(task => 
        task.title?.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority);
    }

    // Due date range filter
    if (filters.dueDateRange) {
      const now = new Date();
      
      result = result.filter(task => {
        if (!task.dueDate) {
          return filters.dueDateRange === 'no-due-date';
        }

        const dueDate = parseISO(task.dueDate);
        
        switch (filters.dueDateRange) {
          case 'overdue':
            return isBefore(dueDate, now) && !isToday(dueDate);
          case 'today':
            return isToday(dueDate);
          case 'this-week':
            return isAfter(dueDate, startOfWeek(now)) && 
                   isBefore(dueDate, endOfWeek(now));
          case 'this-month':
            return isAfter(dueDate, startOfMonth(now)) && 
                   isBefore(dueDate, endOfMonth(now));
          case 'no-due-date':
            return false; // Already filtered out above
          default:
            return true;
        }
      });
    }

    return result;
  }, [tasks, filters]);

  // Sort filtered tasks
  const sortedAndFilteredTasks = useMemo(() => {
    const result = [...filteredTasks];

    result.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'status':
          const statusOrder = { 'Not Started': 1, 'In Progress': 2, 'Completed': 3 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        case 'lastModified':
          aValue = a.lastModified ? new Date(a.lastModified) : new Date(0);
          bValue = b.lastModified ? new Date(b.lastModified) : new Date(0);
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt ? new Date(a.createdAt) : new Date(0);
          bValue = b.createdAt ? new Date(b.createdAt) : new Date(0);
          break;
      }

      if (aValue < bValue) {
        return filters.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return filters.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [filteredTasks, filters.sortBy, filters.sortOrder]);

  // Calculate task counts for filter UI
  const taskCounts = useMemo(() => {
    const counts = {};
    
    // Count by status
    tasks.forEach(task => {
      const status = task.status || 'Not Started';
      counts[status] = (counts[status] || 0) + 1;
    });

    // Count by priority
    tasks.forEach(task => {
      if (task.priority) {
        counts[task.priority] = (counts[task.priority] || 0) + 1;
      }
    });

    return counts;
  }, [tasks]);

  return {
    filters,
    filteredTasks: sortedAndFilteredTasks,
    taskCounts,
    handleFilterChange,
    clearFilters,
    hasActiveFilters: Object.values(filters).some(value => 
      value && value !== 'createdAt' && value !== 'desc'
    ),
  };
};