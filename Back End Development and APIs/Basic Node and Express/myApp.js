// Import express and create an app
const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const path = require('path');
require('dotenv').config();

// Middleware to serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Use body-parser to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: false })); // Mount the middleware

// Route to serve HTML file
app.get('/', (req, res) => {
  const absolutePath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(absolutePath);
});

// Route to serve JSON response
app.get('/json', (req, res) => {
  const messageStyle = process.env.MESSAGE_STYLE;
  const message = messageStyle === 'uppercase' ? 'HELLO JSON' : 'Hello json';
  res.json({ message });
});

// Route to get current time
app.get('/now', (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({ time: req.time });
});

// Echo route
app.get('/:word/echo', (req, res) => {
  const { word } = req.params;
  res.json({ echo: word });
});

/*
// Name route with query parameters
app.route('/name')
  .get((req, res) => {
    const firstName = req.query.first || ''; // Get first name from query
    const lastName = req.query.last || '';   // Get last name from query
    const fullName = `${firstName} ${lastName}`.trim(); // Combine names
    res.json({ name: fullName });
  })
  .post((req, res) => {
    // To handle POST requests for the same route if needed in the future
    res.json({ message: "POST request received" });
  });
*/

// Route to handle POST requests to /name
app.post('/name', (req, res) => {
    const firstName = req.body.first; // Get first name from body
    const lastName = req.body.last; // Get last name from body
    const fullName = `${firstName} ${lastName}`; // Combine names
    res.json({ name: fullName }); // Respond with JSON
});

module.exports = app;
