// server.js
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();

// Serve React app build files
app.use(express.static(path.join(__dirname, 'build')));

// Set up JSON Server for the /api route
app.use('/api', jsonServer.router('db.json'));

// Handle requests that don't match any routes by sending the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
