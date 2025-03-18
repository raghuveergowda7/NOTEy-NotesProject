import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AppContent from './AppContent';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <AppContent />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
