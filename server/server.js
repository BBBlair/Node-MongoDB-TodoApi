var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');

var app = express();

// deployment for Heroku
const port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
//  res.send(req.params);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('ID not valid');
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
//    console.log('Todo By Id', todo);
    res.send({todo});
  }).catch((e) => res.status(404).send(e));
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
