'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fafafa', 
      paper: '#ffffff',   
    },
    text: {
      primary: '#171717',   
      secondary: '#666666', 
    },
    primary: {
      main: '#000000',    
    },
    secondary: {
      main: '#0070f3',    
    },
    divider: '#eaeaea',   
  },
  typography: {
    fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
    h4: { letterSpacing: '-0.05em', fontWeight: 700, color: '#171717' },
    h6: { letterSpacing: '-0.02em', fontWeight: 600, color: '#171717' },
    body1: { fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #eaeaea', // Clean micro-border instead of heavy shadows
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)', // Soft, barely-there elevation
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            backgroundColor: '#111111' 
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            '& fieldset': { borderColor: '#eaeaea' },
            '&:hover fieldset': { borderColor: '#b5b5b5' },
            '&.Mui-focused fieldset': { borderColor: '#000000', borderWidth: '1px' },
          },
        },
      },
    },
  },
});

export default theme;