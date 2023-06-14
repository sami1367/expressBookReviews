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

public_users.post('/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // Assuming the username is stored in the session

  // Find the book in the booksDB
  const book = booksDB.books[isbn];

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Check if the user has already reviewed this book
  const existingReview = book.reviews.find(r => r.username === username);

  if (existingReview) {
    // If the user has already reviewed the book, update the existing review
    existingReview.review = review;
    res.status(200).json({ message: "Book review modified successfully" });
  } else {
    // If the user has not reviewed the book, add a new review
    book.reviews.push({ username, review });
    res.status(200).json({ message: "Book review added successfully" });
  }
});

module.exports.general = public_users;
