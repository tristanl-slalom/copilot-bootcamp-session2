# Coding Guidelines

## Overview

This document outlines the coding standards and best practices for the task management application. These guidelines ensure consistent, maintainable, and high-quality code across the React frontend and Node.js backend.

## General Principles

### Code Quality Standards
- **DRY Principle**: Don't Repeat Yourself - extract common functionality into reusable modules
- **Single Responsibility**: Each function, class, and module should have one clear purpose
- **Dependency Injection**: Use dependency injection patterns to improve testability and flexibility
- **Inversion of Control**: Depend on abstractions, not concretions
- **SOLID Principles**: Follow SOLID design principles for maintainable code

## Formatting and Style

### JavaScript/TypeScript Formatting
- **Indentation**: Use 2 spaces for indentation (no tabs)
- **Semicolons**: Always use semicolons at the end of statements
- **Quotes**: Use single quotes for strings, double quotes for JSX attributes
- **Line Length**: Maximum 100 characters per line
- **Trailing Commas**: Use trailing commas in multi-line objects and arrays

```javascript
// ✅ Good
const taskData = {
  title: 'Sample Task',
  description: 'Task description',
  priority: 'high',
};

// ❌ Bad
const taskData = {
    title: "Sample Task",
    description: "Task description",
    priority: "high"
}
```

### React/JSX Specific
- **Component Names**: Use PascalCase for component names
- **Props**: Use camelCase for prop names
- **JSX Attributes**: Use double quotes for JSX attributes
- **Self-Closing Tags**: Use self-closing tags when there are no children

```jsx
// ✅ Good
<TaskCard 
  title="Sample Task" 
  isCompleted={false} 
  onToggle={handleToggle} 
/>

// ❌ Bad
<TaskCard title='Sample Task' isCompleted={false} onToggle={handleToggle}></TaskCard>
```

## Import Organization

### Import Order
1. **External Libraries**: React, Material-UI, third-party packages
2. **Internal Utilities**: Shared utilities, constants, types
3. **Components**: Local components
4. **Relative Imports**: Files from current directory

```javascript
// ✅ Good Import Order
import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@mui/material';
import { format } from 'date-fns';

import { API_ENDPOINTS } from '../constants/api';
import { validateTask } from '../utils/validation';

import TaskForm from './TaskForm';
import TaskActions from './TaskActions';

import './TaskCard.css';
```

### Import Guidelines
- **Named Imports**: Prefer named imports over default imports when possible
- **Destructuring**: Use destructuring for multiple imports from the same module
- **Absolute Paths**: Use absolute imports for shared utilities and components
- **Group Spacing**: Add blank lines between import groups

## File and Directory Structure

### Naming Conventions
- **Files**: Use camelCase for utility files, PascalCase for components
- **Directories**: Use kebab-case for directories
- **Constants**: Use UPPER_SNAKE_CASE for constants
- **Functions**: Use camelCase for functions and variables

```
src/
├── components/
│   ├── task-management/
│   │   ├── TaskCard.js
│   │   ├── TaskForm.js
│   │   └── index.js
├── utils/
│   ├── dateHelpers.js
│   ├── apiClient.js
│   └── constants.js
```

## React Frontend Guidelines

### Component Structure
```jsx
// ✅ Good Component Structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TaskCard = ({ 
  task, 
  onUpdate, 
  onDelete, 
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Effect logic here
  }, [task.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Card className={`task-card ${className}`}>
      {/* Component JSX */}
    </Card>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

export default TaskCard;
```

### Hooks Guidelines
- **Custom Hooks**: Extract complex state logic into custom hooks
- **Hook Dependencies**: Always include all dependencies in useEffect arrays
- **Hook Naming**: Prefix custom hooks with "use"

```javascript
// ✅ Good Custom Hook
const useTaskManager = (initialTasks = []) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);

  const addTask = async (taskData) => {
    setLoading(true);
    try {
      const newTask = await apiClient.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, addTask };
};
```

### State Management
- **Local State**: Use useState for component-specific state
- **Prop Drilling**: Avoid deep prop drilling; use context or state management
- **Immutable Updates**: Always update state immutably

## Node.js Backend Guidelines

### Module Structure
```javascript
// ✅ Good Module Structure
const express = require('express');
const { body, validationResult } = require('express-validator');

const taskService = require('../services/taskService');
const { asyncHandler } = require('../utils/asyncHandler');
const { validateRequest } = require('../middleware/validation');

class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  createTask = asyncHandler(async (req, res) => {
    const { title, description, dueDate } = req.body;
    
    const task = await this.taskService.createTask({
      title,
      description,
      dueDate,
    });

    res.status(201).json(task);
  });
}

module.exports = TaskController;
```

### Error Handling
- **Async/Await**: Use async/await instead of callbacks
- **Error Middleware**: Use centralized error handling middleware
- **Validation**: Validate all input data

```javascript
// ✅ Good Error Handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
```

## Linting and Code Quality

### ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier Configuration
```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

## Best Practices

### Performance
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Code Splitting**: Implement lazy loading for large components
- **Bundle Optimization**: Avoid importing entire libraries when only using specific functions

### Security
- **Input Validation**: Validate and sanitize all user inputs
- **Environment Variables**: Store sensitive data in environment variables
- **CORS**: Configure CORS appropriately for API endpoints

### Testing
- **Test Coverage**: Write tests for all public methods and components
- **Mock Dependencies**: Mock external dependencies in tests
- **Test Organization**: Co-locate tests with source files

## Code Review Guidelines

### Pull Request Requirements
- **Linting**: All code must pass ESLint checks
- **Tests**: Include tests for new functionality
- **Documentation**: Update documentation for public APIs
- **Small Changes**: Keep PRs focused and reasonably sized

### Review Checklist
- ✅ Code follows formatting guidelines
- ✅ Imports are properly organized
- ✅ No code duplication (DRY principle)
- ✅ Proper error handling
- ✅ Tests included and passing
- ✅ No console.logs in production code

## Tools and Setup

### Required Tools
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **Husky**: For git hooks
- **lint-staged**: For pre-commit linting

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

Following these guidelines ensures consistent, maintainable, and high-quality code that supports the long-term success of the task management application.