const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connect to MongoDB server');
  const db = client.db('TodoApp');

  //deleteMany
  //deleteOne: delete the first the curser sees
  // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) => {
  //   console.log(result);
  // })

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // })

  db.collection('Todos').findOneAndDelete({completed: true});

  //client.close();
});
