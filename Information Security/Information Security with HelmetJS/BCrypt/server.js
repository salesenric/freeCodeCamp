'use strict';

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const bcrypt = require('bcrypt');

const app = express();
fccTesting(app); // Setup testing middleware for FreeCodeCamp

// Configuration
const saltRounds = 12; // Number of salt rounds for bcrypt hashing (higher value means stronger but slower hash)
const myPlaintextPassword = 'sUperpassw0rd!'; // Example password to hash
const someOtherPlaintextPassword = 'pass123'; // Another example password

// START_ASYNC - Asynchronous bcrypt usage

// Hash the password asynchronously
bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password (async):', hash);

  // Compare the original password with the hashed password
  bcrypt.compare(myPlaintextPassword, hash, (err, result) => {
    if (err) {
      console.error('Error comparing passwords:', err);
      return;
    }
    console.log('Password match (async):', result); // true if the passwords match
  });
});

// END_ASYNC

// START_SYNC - Synchronous bcrypt usage

try {
  // Hash the password synchronously
  const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
  console.log('Hashed password (sync):', hash);

  // Compare the original password with the hashed password synchronously
  const result = bcrypt.compareSync(myPlaintextPassword, hash);
  console.log('Password match (sync):', result); // true if the passwords match
} catch (error) {
  console.error('Error during synchronous bcrypt operations:', error);
}

// END_SYNC

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port:', PORT);
});
