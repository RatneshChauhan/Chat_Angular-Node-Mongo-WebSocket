
import 'reflect-metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi'
import { UserService } from '../services/users.service'
export const router: Router = Router();

//@ts-ignore
router.get('/api/users/:email', function (req, res) {
  console.log("LoggedIn Email: ",req.params)
  Container.get<UserService>(UserService).getUsers(req.params.email)
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
  const user = req.body.user
  console.log(user)
  Container.get<UserService>(UserService).createUser(user.email, user.name, user.description, user.password)
    .then((data) => {
      console.log('User SignUp:  ', data)
      res.type("json");
      res.send(data);
    }).catch((error) => {
      console.error(`Error occured while registering a user ${error}`)
    })
});


