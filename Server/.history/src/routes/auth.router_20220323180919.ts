import { NextFunction, Request, Response, Router } from 'express';
const Note = require('../models/note');
export const router: Router = Router();



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