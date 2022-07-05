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
 // console.log('request body: ', body)
  let user;
  Container.get<UserService>(UserService).getUsers(null).then((data) => {
  //  console.log('All Users:  ', data)
    user = data.find(user => user.email === body.email);
   // console.log('user for auth:  ', user)

    if (!user || body.password !== user.password)
      return res.sendStatus(401);
      
    
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    var token = jwt.sign({ userId: user.id, name:user.name, email:user.email, createdAt:'Now' }, process.env.SECRET, { expiresIn: '2h' });
    res.send({ token });

  }).catch((error) => {
    console.error(`Error occured while getting auth user ${error}`)
    return res.sendStatus(401);
  })

});