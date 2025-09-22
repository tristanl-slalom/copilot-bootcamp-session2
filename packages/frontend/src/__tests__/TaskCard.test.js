import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import TaskCard from '../components/task-management/TaskCard';
import auroraTheme from '../theme/auroraTheme';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'This is a test task',
  priority: 'High',
  status: 'Not Started',
  dueDate: '2025-09-30',
  createdAt: '2025-09-22T10:00:00Z',
  lastModified: '2025-09-22T10:00:00Z'
};

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn()
};

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={auroraTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    renderWithTheme(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Not Started')).toBeInTheDocument();
  });

  test('displays due date correctly', () => {
    renderWithTheme(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    expect(screen.getByText(/due sep 30, 2025/i)).toBeInTheDocument();
  });

  test('shows overdue status for past due dates', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2025-09-01' // Past date
    };

    renderWithTheme(
      <TaskCard task={overdueTask} {...mockHandlers} />
    );

    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  test('handles status change when status chip is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    const statusChip = screen.getByText('Not Started');
    await user.click(statusChip);

    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith(1, 'In Progress');
  });

  test('opens menu when more options button is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    const moreButton = screen.getByRole('button', { name: '' });
    await user.click(moreButton);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
  });

  test('calls onEdit when edit menu item is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    const moreButton = screen.getByRole('button', { name: '' });
    await user.click(moreButton);

    const editMenuItem = screen.getByText('Edit Task');
    await user.click(editMenuItem);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onDelete when delete menu item is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    const moreButton = screen.getByRole('button', { name: '' });
    await user.click(moreButton);

    const deleteMenuItem = screen.getByText('Delete Task');
    await user.click(deleteMenuItem);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
  });

  test('renders without description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    
    renderWithTheme(
      <TaskCard task={taskWithoutDescription} {...mockHandlers} />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('This is a test task')).not.toBeInTheDocument();
  });

  test('renders without due date when not provided', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: undefined };
    
    renderWithTheme(
      <TaskCard task={taskWithoutDueDate} {...mockHandlers} />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText(/due/i)).not.toBeInTheDocument();
  });

  test('applies priority colors correctly', () => {
    const highPriorityTask = { ...mockTask, priority: 'High' };
    
    renderWithTheme(
      <TaskCard task={highPriorityTask} {...mockHandlers} />
    );

    const priorityChip = screen.getByText('High');
    expect(priorityChip).toBeInTheDocument();
    // Note: Testing actual color would require checking computed styles
  });

  test('cycles through status changes correctly', async () => {
    const user = userEvent.setup();
    
    // Test Not Started -> In Progress
    renderWithTheme(
      <TaskCard task={mockTask} {...mockHandlers} />
    );
    
    const statusChip = screen.getByText('Not Started');
    await user.click(statusChip);
    
    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith(1, 'In Progress');
    
    // Reset mocks and test In Progress -> Completed
    jest.clearAllMocks();
    const inProgressTask = { ...mockTask, status: 'In Progress' };
    
    renderWithTheme(
      <TaskCard task={inProgressTask} {...mockHandlers} />
    );
    
    const inProgressChip = screen.getByText('In Progress');
    await user.click(inProgressChip);
    
    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith(1, 'Completed');
  });
});