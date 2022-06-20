var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const User = require('../models/');

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

app.use(bodyParser.json());
// We use the express-jwt middleware, tell it what the shared secret is, 
// and specify an array of paths it shouldn’t require a JWT for... 
app.use(expressJwt({secret: 'todo-app-super-shared-secret', algorithms: ['sha1', 'RS256', 'HS256']}).unless({path: ['/api/auth']}));

app.post('/api/auth', function(req, res) {
  const body = req.body;
  console.log('request body: ',      body)

  const user = USERS.find(user => user.email === body.email);
  console.log('user:  ',user)
  if(!user || body.password != 'Todo@123') 
  return res.sendStatus(401);

  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
  res.send({token});
});


var TODOS = [
  { 'id': 1, 'user_id': 1, 'name': "Get Milk", 'completed': false },
  { 'id': 2, 'user_id': 1, 'name': "Fetch Kids", 'completed': true },
  { 'id': 3, 'user_id': 2, 'name': "Buy flowers for wife", 'completed': false },
  { 'id': 4, 'user_id': 3, 'name': "Finish Angular JWT Todo App", 'completed': false },
];
var USERS = [
  { 'id': 1, 'username': 'jemma', 'email':'jemma@gmail.com' },
  { 'id': 2, 'username': 'paul', 'email':'paul@gmail.com' },
  { 'id': 3, 'username': 'sebastian', 'email':'sebastian@gmail.com' },
];
function getMessages(userID) {
  var todos = _.filter(TODOS, ['user_id', userID]);

  return todos;
}
function getMessage(todoID) {
  var todo = _.find(TODOS, function (todo) { return todo.id == todoID; })
  return todo;
}
function getUsers() {
  return USERS;
}

app.get('/api/todos', function (req, res) {
  res.type("json");
  res.send(getMessages(req.user.userID));
});
app.get('/api/todos/:id', function (req, res) {
  var todoID = req.params.id;
  res.type("json");
  res.send(getMessage(todoID));
});
app.get('/api/users', function (req, res) {
  res.type("json");
  res.send(getUsers());
});

router.post('/newUser', async (req, res) => {
  console.log('Adding New User...' + req.body.title);
  let note = await new Note({
      title: req.body.title,
      description: req.body.description,
      createdAt: req.body.createdAt
  });
  
  const filter = { title: req.body.title };
  const update = {
      description: req.body.description,
      createdAt: req.body.createdAt
  };

  try {
      // `doc` is the document _after_ `update` was applied because of
      // `new: true`
      let doc = await Note.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true // Make this update into an upsert
      });
      console.log('NEW DOC: ',doc)
      res.redirect('/notes');
  } catch (e) {
      console.log(e);
  }
})
app.get('/', (req, res) => res.send('hello! server is listening on 3000'));
  http.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {  
   console.log('user connected'); 
   socket.on('message', (msg) => {
 console.log(msg);
 socket.broadcast.emit('message-broadcast', msg);
});
});