const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tasks table with full task management properties
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    dueDate TEXT,
    priority TEXT DEFAULT 'Medium' CHECK(priority IN ('Low', 'Medium', 'High')),
    status TEXT DEFAULT 'Not Started' CHECK(status IN ('Not Started', 'In Progress', 'Completed')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial sample tasks
const initialTasks = [
  {
    title: 'Set up development environment',
    description: 'Install necessary tools and configure the workspace for the project',
    priority: 'High',
    status: 'Completed',
    dueDate: '2025-09-20'
  },
  {
    title: 'Design system architecture',
    description: 'Plan the overall structure and technology stack for the application',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2025-09-25'
  },
  {
    title: 'Implement user authentication',
    description: 'Create login and registration functionality with secure session management',
    priority: 'Medium',
    status: 'Not Started',
    dueDate: '2025-10-01'
  },
  {
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and usage guidelines',
    priority: 'Low',
    status: 'Not Started',
    dueDate: '2025-10-15'
  }
];

const insertTaskStmt = db.prepare(`
  INSERT INTO tasks (title, description, priority, status, dueDate, createdAt, lastModified) 
  VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

initialTasks.forEach(task => {
  insertTaskStmt.run(task.title, task.description, task.priority, task.status, task.dueDate);
});

console.log('In-memory database initialized with sample tasks');

// Prepared statements for better performance
const getAllTasksStmt = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC');
const getTaskByIdStmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
const updateTaskStmt = db.prepare(`
  UPDATE tasks 
  SET title = ?, description = ?, dueDate = ?, priority = ?, status = ?, lastModified = CURRENT_TIMESTAMP 
  WHERE id = ?
`);
const deleteTaskStmt = db.prepare('DELETE FROM tasks WHERE id = ?');

// API Routes for Task Management

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = getAllTasksStmt.all();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Get a specific task
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = getTaskByIdStmt.get(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    
    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    // Validate priority if provided
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }
    
    // Validate status if provided
    if (status && !['Not Started', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Not Started, In Progress, or Completed' });
    }
    
    // Validate due date format if provided
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: 'Invalid due date format' });
    }
    
    const result = insertTaskStmt.run(
      title.trim(),
      description?.trim() || null,
      priority || 'Medium',
      status || 'Not Started',
      dueDate || null
    );
    
    const newTask = getTaskByIdStmt.get(result.lastInsertRowid);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;
    
    // Check if task exists
    const existingTask = getTaskByIdStmt.get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    // Validate priority if provided
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }
    
    // Validate status if provided
    if (status && !['Not Started', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Not Started, In Progress, or Completed' });
    }
    
    // Validate due date format if provided
    if (dueDate && dueDate !== null && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: 'Invalid due date format' });
    }
    
    updateTaskStmt.run(
      title.trim(),
      description?.trim() || null,
      dueDate || null,
      priority || existingTask.priority,
      status || existingTask.status,
      id
    );
    
    const updatedTask = getTaskByIdStmt.get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if task exists
    const existingTask = getTaskByIdStmt.get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    deleteTaskStmt.run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Legacy endpoint for backward compatibility (maps to tasks)
app.get('/api/items', (req, res) => {
  try {
    const tasks = getAllTasksStmt.all();
    // Map tasks to old item format for backward compatibility
    const items = tasks.map(task => ({
      id: task.id,
      name: task.title,
      created_at: task.createdAt
    }));
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }
    
    const result = insertTaskStmt.run(name.trim(), null, 'Medium', 'Not Started', null);
    const newTask = getTaskByIdStmt.get(result.lastInsertRowid);
    
    // Return in old item format
    res.status(201).json({
      id: newTask.id,
      name: newTask.title,
      created_at: newTask.createdAt
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

module.exports = { app, db };