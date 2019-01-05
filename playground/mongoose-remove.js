const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// no removed target is returned
// Todo.remove({}).then((result) => {
//   console.log(result);
// });


//Todo.findOneAndRemove




// Todo.findByIdAndRemove('5c30baadbffb6464509552db').then((todo) => {
//   console.log(todo);
// });
