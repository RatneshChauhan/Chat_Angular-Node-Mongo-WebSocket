
import 'reflect-metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi'
const User = require('../models/user.model');
const Message = require('../models/conversation.model');
import { MessageService } from '../services/message.service'
export const router: Router = Router();


//@ts-ignore
router.post('/api/saveMessages', function (req, res) {
   console.log("Incoming message to save: "+req.body)
    Container.get<MessageService>(MessageService).saveMessage(req.body)
    .then((data) => {
   // console.log('Saved Messages:  ', data)
    res.type("json");
    res.send(data);
    }).catch((error) => {
      console.error(`Error occured while saving messages ${error}`)
    })
  });

//@ts-ignore  
router.get('/api/getMessages/:touserid/:fromuserid', function (req, res) {
 console.log(req.params)
    Container.get<MessageService>(MessageService).getConversation(req.params.touserid, req.params.fromuserid)
    .then((data) => {
  // console.log('Retrieved Messages:  ', data , ' for user: ', req.params.touserid)
    res.type("json");
    res.send(data);
    }).catch((error) => {
      console.error(`Error occured while getting messages ${error}`)
    })
  });
  