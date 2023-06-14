const express = require('express');
const jwt = require('jsonwebtoken');

const regd_users = express.Router();

let users = []; // Array to store user information

const isValid = (username) => {
  // Write code to check if the username is valid
};

const authenticatedUser = (username, password) => {
  // Write code to check if username and password match the one we have in records.
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match a registered user
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ username }, "sami%TTSHDNB#$%^$%#");

  return res.status(200).json({ message: "User login successful", token });
});

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists" });
  }

  // Add the new user to the array
  users.push({ username, password });

  return res.status(200).json({ message: "User registration successful" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;