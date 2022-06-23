import 'reflect-metadata'
import { NextFunction, Request, Response, Router } from 'express';
export const router: Router = Router();

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
import { Container } from 'typedi'
import { UserService } from '../services/users.service'

//@ts-ignore
router.post('/api/auth', async (req, res) => {
  const body = req.body;
  console.log('request body: ', body)
  let user;
  Container.get<UserService>(UserService).getUsers().then((data) => {
    console.log('Users:  ', data)
    user = data.find(user => user.email === body.email);

    if (!user || body.password !== user.password)
      return res.sendStatus(401);
      
    console.log('authenticated user:  ', user)
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    var token = jwt.sign({ userID: user.id }, 'todo-app-super-shared-secret', { expiresIn: '2h' });
    res.send({ token });

  }).catch((error) => {
    console.error(`Error occured while getting auth user ${error}`)
    return res.sendStatus(401);
  })

});