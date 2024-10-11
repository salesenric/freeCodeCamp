require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urlDatabase = {};
let urlCount = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// POST route to shorten URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format
  const urlRegex = /^https?:\/\/(www\.)?.+/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const hostname = originalUrl.replace(/^https?:\/\//, '').split('/')[0];

  // Validate domain with dns.lookup
  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Store and return short URL
    urlDatabase[urlCount] = originalUrl;
    res.json({ original_url: originalUrl, short_url: urlCount });
    urlCount++;
  });
});

// GET route to redirect from short URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  
  const originalUrl = urlDatabase[shortUrl];
  if (!originalUrl) {
    return res.json({ error: 'No URL found' });
  }

  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
