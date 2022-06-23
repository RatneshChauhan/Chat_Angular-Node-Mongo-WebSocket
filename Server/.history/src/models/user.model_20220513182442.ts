const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    default: 'Offline'
  },
  createdAt: {
    type: String,
    default: 'NA',
  },
});

module.exports = mongoose.model('User', userSchema);