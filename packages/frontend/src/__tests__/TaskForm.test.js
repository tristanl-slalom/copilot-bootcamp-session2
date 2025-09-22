import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import TaskForm from '../components/task-management/TaskForm';
import auroraTheme from '../theme/auroraTheme';

const mockHandlers = {
  onClose: jest.fn(),
  onSubmit: jest.fn()
};

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={auroraTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create form when no task is provided', () => {
    renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  test('renders edit form when task is provided', () => {
    const existingTask = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing description',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2025-09-30'
    };

    renderWithTheme(
      <TaskForm open={true} task={existingTask} {...mockHandlers} />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
  });

  test('validates required title field', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument();
    });

    expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    // Fill in form fields
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const dueDateInput = screen.getByLabelText(/due date/i);
    
    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New task description');
    await user.type(dueDateInput, '2025-10-01');

    // Select priority
    const prioritySelect = screen.getByLabelText(/priority/i);
    await user.click(prioritySelect);
    await user.click(screen.getByText('High'));

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New task description',
      dueDate: '2025-10-01',
      priority: 'High',
      status: 'Not Started'
    });
  });

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  test('calls onClose when close icon is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    const closeButton = screen.getByRole('button', { name: '' }); // Close icon
    await user.click(closeButton);

    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  test('disables submit button when loading', () => {
    renderWithTheme(
      <TaskForm open={true} loading={true} {...mockHandlers} />
    );

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  test('clears form when closed and reopened', async () => {
    const { rerender } = renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    const titleInput = screen.getByLabelText(/task title/i);
    await userEvent.type(titleInput, 'Some text');

    // Close and reopen form
    rerender(
      <ThemeProvider theme={auroraTheme}>
        <TaskForm open={false} {...mockHandlers} />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider theme={auroraTheme}>
        <TaskForm open={true} {...mockHandlers} />
      </ThemeProvider>
    );

    const newTitleInput = screen.getByLabelText(/task title/i);
    expect(newTitleInput.value).toBe('');
  });

  test('prefills form when editing existing task', () => {
    const existingTask = {
      id: 1,
      title: 'Edit Me',
      description: 'Edit this description',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: '2025-12-01'
    };

    renderWithTheme(
      <TaskForm open={true} task={existingTask} {...mockHandlers} />
    );

    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit this description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-12-01')).toBeInTheDocument();
    // Priority and status would be selected in their respective dropdowns
  });

  test('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    // Try to submit empty form to generate error
    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument();
    });

    // Start typing in title field
    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'New');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Task title is required')).not.toBeInTheDocument();
    });
  });

  test('handles optional fields correctly', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <TaskForm open={true} {...mockHandlers} />
    );

    // Only fill required field
    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'Minimal Task');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
      title: 'Minimal Task',
      description: '',
      dueDate: null,
      priority: 'Medium',
      status: 'Not Started'
    });
  });
});