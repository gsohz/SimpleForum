const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Model Category
//Model Definition
const Category = new Schema({
  name: {
    type: String,
    required: true
  },

  tag: {
    type: String,
    required: true,
    unique: true
  },

  date: {
    type: Date
  }
})
//Collection
mongoose.model('categories', Category)
