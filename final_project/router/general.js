const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7 — Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  if (users.find(u => u.username === username))
    return res.status(409).json({ message: "User already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 2 — Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 3 — Get by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

// Task 4 — Get by Author
public_users.get('/author/:author', function (req, res) {
  const result = Object.values(books).filter(
    b => b.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if (result.length) return res.status(200).json(result);
  return res.status(404).json({ message: "No books found" });
});

// Task 5 — Get by Title
public_users.get('/title/:title', function (req, res) {
  const result = Object.values(books).filter(
    b => b.title.toLowerCase() === req.params.title.toLowerCase()
  );
  if (result.length) return res.status(200).json(result);
  return res.status(404).json({ message: "No books found" });
});

// Task 6 — Get review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book.reviews);
  return res.status(404).json({ message: "Book not found" });
});

// ── Task 11: Async/Await + Axios ──────────────────────────

// Get all books — async/await
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get by ISBN — async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get by Author — async/await
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get by Title — async/await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;