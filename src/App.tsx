import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { amber, lime } from '@material-ui/core/colors';
import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: lime[500],
    },
    secondary: {
      main: amber[800],
    },
  },
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GameBoard />
    </ThemeProvider>
  );
}

export default App;
