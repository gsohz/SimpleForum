const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Model User
//Model Definition
const User = new Schema({
  name: {
    type: String,
    required: true
  },

  nickName: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

  accountType: {
    type: Number,
    default: 0 //Is'nt adm
  },

  password: {
    type: String,
    required: true
  }
})

//Collection
mongoose.model('users', User)
