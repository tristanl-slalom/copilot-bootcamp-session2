# UI Guidelines

## Overview

This document outlines the user interface design guidelines for the task management application. These guidelines ensure consistency, accessibility, responsiveness, and a cohesive user experience across all devices and screen sizes.

## Design System

### Component Library
- **Material UI Components**: All UI components must use Material-UI (MUI) as the primary component library
- **Responsive Design**: All components must be fully responsive and work seamlessly across desktop, tablet, and mobile devices
- **Consistency**: Maintain consistent spacing, typography, and component usage across all screens and breakpoints
- **Accessibility**: Ensure all components meet WCAG 2.1 AA accessibility standards

## Color Palette

### Aurora Borealis Inspired Theme

Our color palette draws inspiration from the natural beauty of the aurora borealis, featuring deep blues, ethereal greens, and mystical purples.

#### Primary Colors
- **Deep Navy**: `#0B1426` - Primary background, headers
- **Midnight Blue**: `#1A2332` - Secondary backgrounds, cards
- **Arctic Blue**: `#2D3748` - Borders, dividers

#### Accent Colors
- **Aurora Green**: `#4FD1C7` - Primary actions, success states
- **Seafoam**: `#68D391` - Secondary actions, positive feedback
- **Northern Lights Purple**: `#805AD5` - Accent elements, highlights
- **Lavender Mist**: `#B794F6` - Subtle accents, hover states

#### Neutral Colors
- **Ice White**: `#F7FAFC` - Primary text on dark backgrounds
- **Frost Gray**: `#E2E8F0` - Secondary text, placeholders
- **Storm Gray**: `#A0AEC0` - Disabled states, subtle text

#### Status Colors
- **Success**: `#48BB78` (Aurora Green variant)
- **Warning**: `#ED8936` (Warm amber)
- **Error**: `#F56565` (Soft red)
- **Info**: `#4299E1` (Arctic blue variant)

## Typography

### Font Hierarchy
- **Primary Font**: Roboto (Material-UI default)
- **Headings**: Use Material-UI Typography variants (h1-h6)
- **Body Text**: Use Typography body1 and body2 variants
- **Code/Monospace**: Use `monospace` font family for technical elements

### Text Colors
- **Primary Text**: Ice White (`#F7FAFC`) on dark backgrounds
- **Secondary Text**: Frost Gray (`#E2E8F0`)
- **Disabled Text**: Storm Gray (`#A0AEC0`)

## Interactive Elements

### Hover Animations

All interactive elements should include subtle hover animations to provide visual feedback:

#### Buttons
```css
transition: all 0.2s ease-in-out;

/* On hover */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(79, 209, 199, 0.3);
```

#### Cards and Containers
```css
transition: all 0.3s ease-in-out;

/* On hover */
transform: translateY(-1px);
box-shadow: 0 8px 25px rgba(128, 90, 213, 0.15);
border-color: rgba(79, 209, 199, 0.5);
```

#### Links and Text Elements
```css
transition: color 0.2s ease-in-out;

/* On hover */
color: #4FD1C7; /* Aurora Green */
```

#### Icons
```css
transition: all 0.2s ease-in-out;

/* On hover */
transform: scale(1.05);
color: #B794F6; /* Lavender Mist */
```

## Component Guidelines

### Task Cards
- Use Material-UI Card component with aurora-inspired styling
- Include subtle gradient backgrounds using the color palette
- Implement hover animations for interactive feedback

### Forms
- Use Material-UI form components (TextField, Select, etc.)
- Apply aurora color scheme to focus states
- Include smooth transitions for form validation states

### Navigation
- Use Material-UI AppBar and navigation components
- Implement aurora-themed active states
- Include hover animations for navigation items

### Buttons
- Primary: Aurora Green background with hover animations
- Secondary: Outlined style with aurora colors
- Accent: Northern Lights Purple for special actions

## Spacing and Layout

### Grid System
- Use Material-UI Grid system for responsive layouts
- Maintain consistent spacing using MUI's spacing scale (8px base unit)

### Breakpoints
- Follow Material-UI's responsive breakpoints:
  - **xs**: 0px and up (mobile)
  - **sm**: 600px and up (tablet)
  - **md**: 900px and up (small desktop)
  - **lg**: 1200px and up (desktop)
  - **xl**: 1536px and up (large desktop)
- Ensure aurora theme works across all device sizes
- Test all components at each breakpoint

### Responsive Design Principles
- **Mobile-First Approach**: Design for mobile devices first, then scale up
- **Touch-Friendly**: Ensure interactive elements are at least 44px in size for mobile
- **Flexible Layouts**: Use fluid grids and flexible containers
- **Scalable Typography**: Use responsive typography that adapts to screen size
- **Adaptive Navigation**: Implement navigation patterns that work well on all devices

## Accessibility

### Color Contrast
- Ensure all text meets WCAG 2.1 AA contrast requirements against aurora backgrounds
- Test color combinations for accessibility compliance

### Focus States
- Implement aurora-themed focus indicators
- Ensure keyboard navigation is clearly visible

### Screen Readers
- Use proper ARIA labels and semantic HTML
- Ensure animations don't interfere with assistive technologies

## Implementation Notes

### CSS-in-JS
- Use Material-UI's styling solution (styled components or sx prop)
- Create a custom aurora theme using MUI's theme provider

### Animation Performance
- Use CSS transforms for animations to ensure smooth performance
- Limit animations to essential interactive feedback
- Consider `prefers-reduced-motion` for accessibility

### Dark Theme
- The aurora palette is designed primarily for dark theme
- Consider providing a light theme variant if needed

## Usage Examples

### Custom Aurora Theme
```javascript
import { createTheme } from '@mui/material/styles';

const auroraTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FD1C7', // Aurora Green
    },
    secondary: {
      main: '#805AD5', // Northern Lights Purple
    },
    background: {
      default: '#0B1426', // Deep Navy
      paper: '#1A2332', // Midnight Blue
    },
    text: {
      primary: '#F7FAFC', // Ice White
      secondary: '#E2E8F0', // Frost Gray
    },
  },
});
```

This UI guidelines document ensures a cohesive, accessible, and visually striking user interface that captures the ethereal beauty of the aurora borealis while maintaining professional usability standards.