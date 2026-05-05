const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Unable to register user." });
    }
  
    if (isValid(username)) {
      return res.status(404).json({ message: "User already exists!" });
    }
  
    users.push({
      username: username,
      password: password
    });
  
    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  });


// ✅ Get all books
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("Books not found");
      }
    });
  
    getBooks
      .then((bookList) => {
        return res.status(200).send(JSON.stringify(bookList, null, 4));
      })
      .catch((error) => {
        return res.status(404).json({ message: error });
      });
  });


// ✅ Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const getBookByISBN = new Promise((resolve, reject) => {
      const book = books[isbn];
  
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  
    getBookByISBN
      .then((book) => {
        return res.status(200).json(book);
      })
      .catch((error) => {
        return res.status(404).json({ message: error });
      });
  });


// ✅ Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const filtered_books = Object.values(books).filter(
        (book) => book.author === author
      );
  
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject("No books found for this author");
      }
    });
  
    getBooksByAuthor
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error) => {
        return res.status(404).json({ message: error });
      });
  });


// ✅ Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const getBooksByTitle = new Promise((resolve, reject) => {
      const filtered_books = Object.values(books).filter(
        (book) => book.title === title
      );
  
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject("No books found with this title");
      }
    });
  
    getBooksByTitle
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error) => {
        return res.status(404).json({ message: error });
      });
  });


// ✅ Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});


module.exports.general = public_users;