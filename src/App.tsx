import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { lime, amber } from '@material-ui/core/colors';

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

interface AppProps { }

class App extends React.Component<AppProps> {
  render = () => {
    return (
      <ThemeProvider theme={theme}>
        <GameBoard />
      </ThemeProvider>
    );
  }
}

export default App;
