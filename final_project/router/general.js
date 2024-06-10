const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  users.push({username, password});
  return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async(req,res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  res.json(booksByAuthor);
});

// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  res.json(booksByTitle);
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } 
  else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
