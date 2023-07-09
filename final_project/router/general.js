const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require('body-parser')


public_users.post("/register", bodyParser.urlencoded({extended: true}), (req,res) => {
  let valischeck = isValid(req.body.username);
  if(valischeck){
    users.push({username: req.body.username, password: req.body.password})
    res.status(201).json({message: 'registered successfully'})
  }
  else {
    res.json({message: 'username is already used'})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  if(books){
    return res.status(200).json(books)
  }
  else{
    return res.json({message: "there is no books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if(book) res.status(200).json(book)
  else res.json({message: "not founded"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let nbooks = [];
  function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
  }
  let arr = json2array(books);
  for(let i=0; i<arr.length;i++){
    if(arr[i].author === author){
      nbooks.push(arr[i]);
    }
  }
  if(nbooks){
    return res.status(200).json(nbooks);
  }
  else{
    return res.json({message: "not founded"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let searchbooks = [];
  function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
  }
  let arr = json2array(books);
  for(let i=0; i<arr.length;i++){
    if(arr[i].title === title){
      searchbooks.push(arr[i]);
    }
  }
  if(searchbooks){
    return res.status(200).json(searchbooks);
  }
  else{
    return res.json({message: "not founded"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let bookReviews = books[req.params.isbn].reviews
  if(bookReviews) res.status(200).json(bookReviews)
  else res.status(200).json({message: "there is no reviews on this book"});
});

module.exports.general = public_users;
