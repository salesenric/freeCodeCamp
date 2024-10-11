var express = require('express');
var cors = require('cors');
var multer  = require('multer');
require('dotenv').config();

var app = express();
var upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API endpoint to handle file uploads
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded.' });
  }

  // Prepare the file metadata response
  const fileMetadata = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size // Size in bytes
  };

  // Send the metadata as JSON
  res.json(fileMetadata);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
