const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bodyParser = require('body-parser')

let users = [];

const isValid = (username)=>{ 
  let obj = users.find(o => o.username === username);
  if(obj){
    return false
  }
  else{
    return true
  }
}

function authenticatedUser (username,password){
  let result;
  for(let i =0; i<users.length;i++){
    if(users[i].username == username && users[i].password == password){
      result = true
    }
  }
  return result
}

//only registered users can login
regd_users.post("/login", bodyParser.urlencoded({extended: true}), (req,res) => {
  let authenication = authenticatedUser(req.body.username, req.body.password);
  if(authenication){
     req.session.username = req.body.username;
     const user = {
      username: req.body.username,
    };
    jwt.sign({user}, 'secretkey', { expiresIn: '60m' }, (err, token) => {
      res.json({token}); 
    });
  }  
  else return res.json({message: "wrong username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.username;
  let review = req.body.review;
  books[req.params.isbn].reviews.push({username: username, review: review})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.username;
  books[req.params.isbn].reviews = books[req.params.isbn].reviews.filter((review => review.username != username))
  res.json(books)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
