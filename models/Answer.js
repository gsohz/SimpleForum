const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Model Category
//Model Definition
const Answer = new Schema({
  questionSlug: {
    type: String,
    required: true
  },

  questionID: {
    type: String,
    required: true
  },

  answerContent: {
    type: String,
    required: true
  },

  date: {
    type: Date
  },

  author: {
    type: String,
    required: true
  }
})
//Collection
mongoose.model('answers', Answer)
