var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

app.use(bodyParser.json());

app.post('/api/auth', function(req, res) {
  const body = req.body;

  const user = USERS.find(user => user.username == body.username);
  if(!user || body.password != 'todo') return res.sendStatus(401);
  
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
  res.send({token});
});

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