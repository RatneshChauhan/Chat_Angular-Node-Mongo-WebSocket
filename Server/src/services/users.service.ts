
import { Service } from 'typedi'
const User = require('../models/user.model');



@Service()
//@ts-ignore
export class UserService {

  constructor() { }

  public async getUsers(loggedInEmail: string) {
    // ne => not equal to logged in email
    // if name column exists in the doc
    // sort by name
    const users = await User.find({ email: { $ne: loggedInEmail }, name: { $exists: true } }).sort({ 'name': 1 });
    return users;
  }

  public async createUser(email, name, description, password) {
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

  public async updateUser(user) {
    const filter = { _id: user.userId };
    const update = {
      status: user.status
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
}
