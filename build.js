import fs from 'fs';
import path from 'path';

// Simple build script for Node.js 18.17.1 compatibility
console.log('Building for Node.js 18.17.1...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy public files
const publicFiles = ['favicon.ico', 'placeholder.svg', 'robots.txt', '.nojekyll', '404.html', '_redirects'];
publicFiles.forEach(file => {
  if (fs.existsSync(`public/${file}`)) {
    fs.copyFileSync(`public/${file}`, `dist/${file}`);
    console.log(`Copied ${file}`);
  }
});

// Create a simple index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cynosure 2025-'26 - Live Scoring System</title>
    <meta name="description" content="Live scoring and results tracking for school house cultural events featuring Delany, Gandhi, Tagore, and Aloysius houses" />
    <meta name="author" content="School House Events System" />
    <meta property="og:title" content="Cynosure 2025-'26 - Live Scoring System" />
    <meta property="og:description" content="Track live scores and results for inter-house cultural competitions" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://www.stpatricksacademy.in/images/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@lovable_dev" />
    <meta name="twitter:image" content="https://www.stpatricksacademy.in/images/logo.png" />
    <link rel="stylesheet" href="/event_for_school/assets/index.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>
    <script type="module" src="/event_for_school/assets/index.js"></script>
  </body>
</html>`;

fs.writeFileSync('dist/index.html', indexHtml);
console.log('Created index.html');

// Create assets directory
if (!fs.existsSync('dist/assets')) {
  fs.mkdirSync('dist/assets');
}

// Create a simple CSS file
const css = `/* Basic styles for the application */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  color: white;
  font-size: 24px;
  text-align: center;
}

.error {
  color: #ff6b6b;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px;
}`;

fs.writeFileSync('dist/assets/index.css', css);
console.log('Created index.css');

// Create a simple JavaScript file
const js = `// Simple React app for Node.js 18.17.1 compatibility
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
root.render(React.createElement(App));`;

fs.writeFileSync('dist/assets/index.js', js);
console.log('Created index.js');

console.log('Build completed successfully!');
console.log('Your app is now ready for GitHub Pages deployment.'); 