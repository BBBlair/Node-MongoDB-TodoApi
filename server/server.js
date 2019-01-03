var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

//set a route
app.post('/todos', (req, res) => {
  // console.log(req.body);
  var todo = new Todo({
    text:req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

// app.get('/', (req, res) => {
//   return console.log("Welcome to Blair's personal website!!");
//   next();
// });

app.listen(3000, () => {
  console.log('Started on port 3000');
});
