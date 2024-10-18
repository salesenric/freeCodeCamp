const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: [String], default: [] },
    commentcount: { type: Number, default: 0 }
});

// Create the Book model based on the schema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
