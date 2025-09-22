import { renderHook, act } from '@testing-library/react';
import { useTaskFilters } from '../hooks/useTaskFilters';

const mockTasks = [
  {
    id: 1,
    title: 'First Task',
    description: 'First description',
    priority: 'High',
    status: 'Not Started',
    dueDate: '2025-09-25',
    createdAt: '2025-09-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'Second description',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2025-09-15', // Past date for overdue testing
    createdAt: '2025-09-21T10:00:00Z'
  },
  {
    id: 3,
    title: 'Third Task',
    description: 'Third description',
    priority: 'Low',
    status: 'Completed',
    dueDate: null,
    createdAt: '2025-09-22T10:00:00Z'
  }
];

describe('useTaskFilters', () => {
  test('initially returns all tasks', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    expect(result.current.filteredTasks).toHaveLength(3);
    expect(result.current.filteredTasks[0].id).toBe(3); // Most recent first (default sort)
  });

  test('filters tasks by search term', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('search', 'First');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe('First Task');
  });

  test('filters tasks by status', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('status', 'In Progress');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].status).toBe('In Progress');
  });

  test('filters tasks by priority', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('priority', 'High');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].priority).toBe('High');
  });

  test('filters overdue tasks', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('dueDateRange', 'overdue');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].dueDate).toBe('2025-09-15');
  });

  test('filters tasks with no due date', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('dueDateRange', 'no-due-date');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].dueDate).toBe(null);
  });

  test('sorts tasks by title', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('sortBy', 'title');
      result.current.handleFilterChange('sortOrder', 'asc');
    });

    expect(result.current.filteredTasks[0].title).toBe('First Task');
    expect(result.current.filteredTasks[1].title).toBe('Second Task');
    expect(result.current.filteredTasks[2].title).toBe('Third Task');
  });

  test('sorts tasks by priority', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('sortBy', 'priority');
      result.current.handleFilterChange('sortOrder', 'desc');
    });

    // Should be ordered: High (3), Medium (2), Low (1)
    expect(result.current.filteredTasks[0].priority).toBe('High');
    expect(result.current.filteredTasks[1].priority).toBe('Medium');
    expect(result.current.filteredTasks[2].priority).toBe('Low');
  });

  test('sorts tasks by due date', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('sortBy', 'dueDate');
      result.current.handleFilterChange('sortOrder', 'asc');
    });

    // Tasks with no due date should come last, others in date order
    expect(result.current.filteredTasks[0].dueDate).toBe('2025-09-15');
    expect(result.current.filteredTasks[1].dueDate).toBe('2025-09-25');
    expect(result.current.filteredTasks[2].dueDate).toBe(null);
  });

  test('calculates task counts correctly', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    expect(result.current.taskCounts['Not Started']).toBe(1);
    expect(result.current.taskCounts['In Progress']).toBe(1);
    expect(result.current.taskCounts['Completed']).toBe(1);
    expect(result.current.taskCounts['High']).toBe(1);
    expect(result.current.taskCounts['Medium']).toBe(1);
    expect(result.current.taskCounts['Low']).toBe(1);
  });

  test('clears all filters', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    // Set some filters
    act(() => {
      result.current.handleFilterChange('search', 'test');
      result.current.handleFilterChange('status', 'Completed');
      result.current.handleFilterChange('priority', 'High');
    });

    expect(result.current.filters.search).toBe('test');
    expect(result.current.filters.status).toBe('Completed');

    // Clear filters
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.status).toBe('');
    expect(result.current.filters.priority).toBe('');
    expect(result.current.filteredTasks).toHaveLength(3);
  });

  test('detects active filters correctly', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.handleFilterChange('search', 'test');
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.hasActiveFilters).toBe(false);
  });

  test('combines multiple filters correctly', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.handleFilterChange('status', 'Not Started');
      result.current.handleFilterChange('priority', 'High');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe(1);
  });

  test('handles empty task array', () => {
    const { result } = renderHook(() => useTaskFilters([]));

    expect(result.current.filteredTasks).toHaveLength(0);
    expect(result.current.taskCounts).toEqual({});
  });

  test('handles search in both title and description', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    // Search for text that appears in description
    act(() => {
      result.current.handleFilterChange('search', 'description');
    });

    expect(result.current.filteredTasks).toHaveLength(3); // All tasks have "description" in their description

    // Search for specific title
    act(() => {
      result.current.handleFilterChange('search', 'Second');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe('Second Task');
  });
});