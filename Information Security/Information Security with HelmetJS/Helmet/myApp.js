// Import required modules
const express = require('express'); // Express is a minimal web framework for Node.js
const app = express(); // Initialize an Express application
const helmet = require('helmet'); // Helmet is a collection of security middlewares for Express

// Remove 'X-Powered-By' header to hide information about the underlying technology (Express)
app.use(helmet.hidePoweredBy());

// Enable 'X-XSS-Protection' header to help prevent cross-site scripting (XSS) attacks
app.use(helmet.xssFilter());

// Enable 'X-Content-Type-Options: nosniff' to prevent browsers from MIME-type sniffing
app.use(helmet.noSniff());

// Enable 'X-Download-Options: noopen' to prevent Internet Explorer from executing downloads in the context of the site
app.use(helmet.ieNoOpen());

// Enable HTTP Strict Transport Security (HSTS) to force HTTPS, with a max age of 90 days
// 'force: true' ensures that the header is set even if the connection is not secure
app.use(helmet.hsts({ maxAge: 90 * 24 * 60 * 60, force: true }));

// Disable client-side caching using 'Cache-Control' and 'Pragma' headers
app.use(helmet.noCache());

// Enable 'X-Frame-Options: DENY' to prevent clickjacking by disallowing the app to be displayed in a frame
// app.use(helmet.frameguard({ action: 'deny' }));

// Content Security Policy (CSP) configuration using Helmet
// This middleware helps prevent XSS by controlling the sources of content
/*
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],       // Allow content only from the site's own origin
    scriptSrc: ["'self'", 'trusted-cdn.com'] // Allow scripts only from the site and 'trusted-cdn.com'
  },
}));
*/

// Alternative configuration of Helmet with multiple settings in one call
app.use(helmet({
  frameguard: {
    action: 'deny', // Prevent the app from being displayed in a frame (clickjacking protection)
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],       // Default source for all content is the site's own origin
      scriptSrc: ["'self'", 'trusted-cdn.com'] // Allow scripts from the site and 'trusted-cdn.com'
    }
  },
  dnsPrefetchControl: false // Disable 'X-DNS-Prefetch-Control' header to allow DNS prefetching
}));

// Export the Express app for use in other files
module.exports = app;

// Import the API routes from 'server.js'
const api = require('./server.js');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Disable 'Strict-Transport-Security' header (not recommended for production)
app.disable('strict-transport-security');

// Use API routes for paths starting with '/_api'
app.use('/_api', api);

// Serve the main HTML file for the root route
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Set the server port, defaulting to 3000 if not specified in the environment variables
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
