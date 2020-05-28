//jshint esversion:6
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');
require('dotenv').config();

const app = express();
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({
   extended: true
 }));
 app.set('view engine','ejs');

 mongoose.connect(`mongodb+srv://${process.env.MONGO_CRED}@cluster0-aujzw.mongodb.net/userDB`,{ useNewUrlParser: true })

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

let secret = "moidhasanbeig";

userSchema.plugin(encrypt,{secret:secret, encryptedFields: ['password']});

const User = new mongoose.model("User",userSchema);

app.get("/", (req,res) => {
  res.render("home");
});
app.get("/login", (req,res) => {
  res.render("login");
});
app.get("/register", (req,res) => {
  res.render("register");
});

app.post("/register", (req,res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req,res) => {
  User.findOne({username: req.body.username},function(err,foundUser) {
    if(err){
      console.log(err);
    } else {
      if(foundUser) {
        if(foundUser.password === req.body.password) {
          res.render("secrets");
        }
      }
    }
  });
});

 app.listen(3000, () => {
   console.log("Server live @3000");
 });
