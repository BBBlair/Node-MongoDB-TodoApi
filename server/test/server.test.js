const expect  = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//mocha features
beforeEach(populateUsers);
beforeEach(populateTodos);

//describe() is a mocha feature:  no need to import
describe('POST /todos', () => {
  //it is a mocha feature
  it('should creat a new todo', (done) => {
    var text = 'Test to do text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({}).then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('POST /users', () => {
  it('should create a user', (done) => {
      var email = 'example@example.com';
      var password = '123456';

      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          User.findOne({email}).then((user) => {
            expect(user).toBeTruthy();
            //expect(user.password).toNotBe(password);
            done();
          }).catch((e) => done(e));
        });

      });

  it('should return validation errors if request', (done) => {
    request(app)
      .post('/users') //invalid e/pw
      .send({email: 123, password: 456})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var userX = users[1];
    request(app)
      .post('/users')
      .send({email: userX.email, password:userX.password})
      .expect(400)
      .end(done);
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});


describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    //valid email and pw
    request(app)
      .post('/users/login')
      .send({email:users[1].email, password:users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toMatchObject({
            access:'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({email:users[1].email, password:'xyz'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123ac`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('DELETE /todos/:id', () => {
  it('should delete a todo doc', (done) => {
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(todos[1]._id.toHexString()).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should delete a todo doc', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(todos[1]._id.toHexString()).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid ids', (done) => {
    request(app)
      .delete(`/todos/123ac`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('PATCH /todos/:id', () => {
  var update = {
    text: 'Enjoy life',
    completed: true
  };

  var update2 = {
    text: 'Revise Resume',
    completed: false
  };

  it('should update the todo', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send(update)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(update.text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the todo created by other users', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send(update)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .send(update2)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toEqual(update2.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});
