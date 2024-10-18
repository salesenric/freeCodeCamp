'use strict';

const mongoose = require('mongoose');
const Book = require('../models/Book');

module.exports = function (app) {

  // Route for handling all books
  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find();
        res.json(books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        })));
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving books');
      }
    })

    .post(async function (req, res) {
      const title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }

      const newBook = new Book({ title, comments: [] });
      try {
        const savedBook = await newBook.save();
        res.json({
          _id: savedBook._id,
          title: savedBook.title,
          commentcount: savedBook.comments.length
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error saving book');
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany();
        res.send('complete delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting books');
      }
    });

  // Route for handling a specific book by ID
  app.route('/api/books/:id')
    .get(async function (req, res) {
      const bookId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(200).send('no book exists'); // Handle invalid ObjectId
      }

      try {
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(200).send('no book exists'); // Handle non-existent book
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving book');
      }
    })

    .post(async function (req, res) {
      const bookId = req.params.id;
      const comment = req.body.comment;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(200).send('no book exists'); // Handle invalid ObjectId
      }

      if (!comment) {
        return res.status(200).send('missing required field comment'); // Handle missing comment
      }

      try {
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(200).send('no book exists'); // Handle non-existent book
        }

        book.comments.push(comment);
        const updatedBook = await book.save();
        res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments,
          commentcount: updatedBook.comments.length
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error adding comment');
      }
    })

    .delete(async function (req, res) {
      const bookId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(200).send('no book exists'); // Handle invalid ObjectId
      }

      try {
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) {
          return res.status(200).send('no book exists'); // Handle non-existent book
        }
        res.send('delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting book');
      }
    });
};
