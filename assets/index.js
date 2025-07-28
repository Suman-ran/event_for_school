// Simple React app for Node.js 18.17.1 compatibility
import React from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const App = () => {
  return React.createElement('div', { 
    style: { 
      color: 'white', 
      textAlign: 'center',
      padding: '20px'
    } 
  }, [
    React.createElement('h1', { key: 'title' }, 'Cynosure 2025-26'),
    React.createElement('p', { key: 'subtitle' }, 'Live Scoring System'),
    React.createElement('p', { key: 'status' }, 'Application is loading...'),
    React.createElement('p', { key: 'note' }, 'Please update Node.js to 18.18.0+ for full functionality')
  ]);
};

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));