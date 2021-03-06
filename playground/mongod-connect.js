//const MongoClient = require('mongodb').MongoClient;

//Destructing
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connect to MongoDB server');
  const db = client.db('TodoApp');

  db.collection('Todos').insertMany([{
    text: ' Something to do',
    completed: false
  }, {
    text: 'Eat lunch',
    completed: false    
  }, {
    text: 'Eat lunch',
    completed: true
  }], (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  // db.collection('Doc').insertOne({
  //   name: 'Blair',
  //   age: 23,
  //   location: 'New York'
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert Doc', err);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // });

  client.close();
});
