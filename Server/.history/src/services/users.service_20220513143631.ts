
import { Service } from 'typedi'
const User = require('../models/user.model');



@Service()
//@ts-ignore
export class UserService {

  constructor() { }

  public async  getUsers() {
    const users = await User.find();
    //return USERS;
    return users;
  }

  public async  createUser(email, name, description, password) {
    let user = await new User({
      email: email,
      name: name,
      description: description,
      password: password
    });

    const filter = { email: email };
    const update = {
      description: description,
      name: name,
      password: password
    };

    try {
      // `doc` is the document _after_ `update` was applied because of
      // `new: true`
      let doc = await User.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      return doc;

    } catch (e) {
      console.log(e);
    }
  }

  public async  updateUser(id, email, name, description, password, status) {
    const filter = { _id: id };
    const update = {
      description: description,
      name: name,
      status: status
    };
  }
}
