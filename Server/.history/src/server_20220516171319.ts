var app = require('express')();

const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
require('dotenv').config()

import * as bodyParser from 'body-parser';
app.use(bodyParser.json());

import { router as authRouter } from './routes/auth.router'
import { router as userRouter } from './routes/user.router'
import { router as messageRouter } from './routes/message.router'

import { Container } from 'typedi'
import { UserService } from './services/users.service'

app.use(authRouter);
app.use(userRouter);
app.use(messageRouter);


// We use the express-jwt middleware, tell it what the shared secret is, 
// and specify an array of paths it shouldn’t require a JWT for... 
app.use(expressJwt(
  {
    secret: process.env.SECRET,
    algorithms: ['sha1', 'RS256', 'HS256']
  }).unless({
    path: ['/api/auth', '/api/register', '/testApi']
  }));

// For local DEV testing, auth exempted endpoint
app.get('/testApi', (req, res) => {
  res.send('hello! server is listening on 3000, this endpoint is auth exempted');
})

// http stuff...
const http = require('http').createServer(app);
http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Socket io stuff goes down here...
const io = require('socket.io')(http);
io.on('connection', (socket) => {
  console.log('Socket Connected !!!')

  socket.on('joinUser', (user) => {
    if (user) {
      socket.join(user.userID);
      console.log('User joined in! ONNLINE ', user);
      socket.broadcast.emit('ONLINE', {
        text: 'online',
        sentAt: null,
        to: '',
        from: {
          senderUserId: user.userID,
          senderEmail: user.userEmail,
          senderUserName: user.userName
        }

      })
      user.status = "ONLINE"
      Container.get<UserService>(UserService).updateUser(user)
        .then((data) => { console.log('status updated: ', data) })
    }
  });

  socket.on('forceDisconnect', (user) => {
    socket.broadcast.emit('OFFLINE', {
      text: 'offline',
      to: '',
      sentAt: null,
      from: {
        senderUserId: user.userID,
        senderEmail: user.userEmail,
        senderUserName: user.userName
      }

    })
    user.status = "OFFLINE"
    Container.get<UserService>(UserService).updateUser(user)
      .then((data) => { console.log('status updated: ', data) })
    console.log('Byeee bro! OFFLINE ', user)
    // socket.disconnect()
  })

  // socket.on('disconnect', () => {
  //   console.log('Socket internal disconnect !!!')
  // })

  socket.on("privateMessage", (message) => {
    console.log('--Private Message--')
    console.log('  ', message)
    const recId = message.to.recieverUserId
    console.log('server emitting event: ', 'PRIVATE_' + recId)
    socket.broadcast.to(recId).emit('PRIVATE_' + recId, message);
  });
});

// mongo stuff goes down here...
mongoose.connect(process.env.SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});