const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connect to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5c2e576fe7d3dd4798db21c3')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false   //when false, it returns updated document
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Doc').findOneAndUpdate({name: 'Mike'}, {
    $set: {
      name: 'Lulu'
    },
    $inc: {
      age: +1
    }
  }, {
    returnOriginal: false   //when false, it returns updated document
  }).then((result) => {
    console.log(result);
  });

  //client.close();
});
