var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

app.use(bodyParser.json());
// We use the express-jwt middleware, tell it what the shared secret is, 
// and specify an array of paths it shouldn’t require a JWT for... 
app.use(expressJwt({secret: 'todo-app-super-shared-secret', algorithms: ['RS256']}).unless({path: ['/api/auth']}));

app.post('/api/auth', function(req, res) {
  const body = req.body;

  const user = USERS.find(user => user.username == body.username);
  if(!user || body.password != 'todo') 
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
  { 'id': 1, 'username': 'jemma' },
  { 'id': 2, 'username': 'paul' },
  { 'id': 3, 'username': 'sebastian' },
];
function getTodos(userID) {
  var todos = _.filter(TODOS, ['user_id', userID]);

  return todos;
}
function getTodo(todoID) {
  var todo = _.find(TODOS, function (todo) { return todo.id == todoID; })

  return todo;
}
function getUsers() {
  return USERS;
}

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