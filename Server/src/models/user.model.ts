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
  status: {
    type: String,
    default: 'offline'
  },
  phone: {
    status: {
      type: String,
      default: '98XXX123'
    },
  },
  createdAt: {
    type: String,
    default: 'NA_CREATIONDATE',
  },
  DOB: {
    type: String,
    default: 'NA_DOB',
  },
});

module.exports = mongoose.model('User', userSchema);