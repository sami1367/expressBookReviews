const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username or password is missing
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ error: "Username already exists" });
  }

  // Add the new user to the list of registered users
  users.push({ username, password });

  return res.status(200).json({ message: "User registration handled successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Write your code here to get the list of books available in the shop
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  // Check if the book exists
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    return res.status(200).json({ book: book });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  return res.status(200).json({ books: filteredBooks });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  return res.status(200).json({ books: filteredBooks });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;

  // Check if the book exists
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    const reviews = book.reviews;

    return res.status(200).json({ reviews: reviews });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;
