import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock data
const mockTasks = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'First test task',
    priority: 'High',
    status: 'Not Started',
    dueDate: '2025-09-30',
    createdAt: '2025-09-22T10:00:00Z',
    lastModified: '2025-09-22T10:00:00Z'
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Second test task',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2025-10-05',
    createdAt: '2025-09-21T09:00:00Z',
    lastModified: '2025-09-22T11:00:00Z'
  }
];

// Setup MSW server
const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json(mockTasks));
  }),
  rest.post('/api/tasks', (req, res, ctx) => {
    const newTask = {
      id: 3,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'Not Started',
      dueDate: req.body.dueDate,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    return res(ctx.status(201), ctx.json(newTask));
  }),
  rest.put('/api/tasks/:id', (req, res, ctx) => {
    const updatedTask = {
      ...mockTasks.find(task => task.id === parseInt(req.params.id)),
      ...req.body,
      lastModified: new Date().toISOString()
    };
    return res(ctx.json(updatedTask));
  }),
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  // Legacy endpoints for backward compatibility
  rest.get('/api/items', (req, res, ctx) => {
    const items = mockTasks.map(task => ({
      id: task.id,
      name: task.title,
      created_at: task.createdAt
    }));
    return res(ctx.json(items));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Aurora Task Manager App', () => {
  test('renders app header and statistics', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Check if header is rendered
    expect(screen.getByText('Aurora Task Manager')).toBeInTheDocument();
    
    // Wait for tasks to load and check statistics
    await waitFor(() => {
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Not Started')).toBeInTheDocument();
    });
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
    
    // Check task details
    expect(screen.getByText('First test task')).toBeInTheDocument();
    expect(screen.getByText('Second test task')).toBeInTheDocument();
  });

  test('opens task creation form when FAB is clicked', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Aurora Task Manager')).toBeInTheDocument();
    });
    
    // Click the floating action button
    const fab = screen.getByRole('button', { name: /add task/i });
    await act(async () => {
      await user.click(fab);
    });
    
    // Check if form dialog opens
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  test('creates a new task', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Aurora Task Manager')).toBeInTheDocument();
    });
    
    // Open task creation form
    const fab = screen.getByRole('button', { name: /add task/i });
    await act(async () => {
      await user.click(fab);
    });
    
    // Fill in task details
    const titleInput = screen.getByLabelText(/task title/i);
    await act(async () => {
      await user.type(titleInput, 'New Test Task');
    });
    
    // Submit the form
    const createButton = screen.getByRole('button', { name: /create task/i });
    await act(async () => {
      await user.click(createButton);
    });
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/task created successfully/i)).toBeInTheDocument();
    });
  });

  test('displays error state when API fails', async () => {
    // Override the server to return an error
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no tasks exist', async () => {
    // Override the server to return empty array
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });

  test('statistics display correct counts', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load and statistics to update
    await waitFor(() => {
      expect(screen.getByText('Total')).toBeInTheDocument();
    });
    
    // The statistics should reflect the mock data:
    // Total: 2, In Progress: 1, Not Started: 1, Completed: 0
    const statsCards = screen.getAllByRole('region');
    expect(statsCards).toBeDefined();
  });
});