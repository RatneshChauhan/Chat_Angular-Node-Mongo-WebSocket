
import 'reflect-metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi'
import { UserService } from '../services/users.service'
export const router: Router = Router();

//@ts-ignore
router.get('/api/users', function (req, res) {
    Container.get<UserService>(UserService).getUsers()
    .then((data) => {
  //  console.log('Users:  ', data)
    res.type("json");
    res.send(data);
    }).catch((error) => {
      console.error(`Error occured while getting users ${error}`)
    })
 });

 //@ts-ignore
router.post('/api/register', function (req, res) {
  console.log(req)
  Container.get<UserService>(UserService).createUser(req.body.email,req.body.name,req.body.description,req.body.password)
  .then((data) => {
  console.log('User SignUp:  ', data)
  res.type("json");
  res.send(data);
  }).catch((error) => {
    console.error(`Error occured while registering a user ${error}`)
  })
});


