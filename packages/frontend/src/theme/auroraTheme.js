import { createTheme } from '@mui/material/styles';

const auroraTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FD1C7', // Aurora Green
      light: '#68D391', // Seafoam
      dark: '#38B2AC',
    },
    secondary: {
      main: '#805AD5', // Northern Lights Purple
      light: '#B794F6', // Lavender Mist
      dark: '#6B46C1',
    },
    background: {
      default: '#0B1426', // Deep Navy
      paper: '#1A2332', // Midnight Blue
    },
    surface: {
      main: '#2D3748', // Arctic Blue
    },
    text: {
      primary: '#F7FAFC', // Ice White
      secondary: '#E2E8F0', // Frost Gray
      disabled: '#A0AEC0', // Storm Gray
    },
    success: {
      main: '#48BB78',
    },
    warning: {
      main: '#ED8936',
    },
    error: {
      main: '#F56565',
    },
    info: {
      main: '#4299E1',
    },
    divider: '#2D3748', // Arctic Blue
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#F7FAFC',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#F7FAFC',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#F7FAFC',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#F7FAFC',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#F7FAFC',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#F7FAFC',
    },
    body1: {
      color: '#F7FAFC',
    },
    body2: {
      color: '#E2E8F0',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A2332',
          border: '1px solid #2D3748',
          borderRadius: '12px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px rgba(128, 90, 213, 0.15)',
            borderColor: 'rgba(79, 209, 199, 0.5)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 209, 199, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1A2332',
            '& fieldset': {
              borderColor: '#2D3748',
            },
            '&:hover fieldset': {
              borderColor: '#4FD1C7',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4FD1C7',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#E2E8F0',
            '&.Mui-focused': {
              color: '#4FD1C7',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#F7FAFC',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A2332',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2D3748',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4FD1C7',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4FD1C7',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A2332',
          borderBottom: '1px solid #2D3748',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            color: '#B794F6',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default auroraTheme;