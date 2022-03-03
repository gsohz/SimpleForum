const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Model Questions
//Model Definition
const Question = new Schema({
  title: {
    type: String,
    required: true
  },

  questionContent: {
    type: String,
    required: true
  },

  date: {
    type: Date
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },

  authorId: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: true
  }
})

//Collection
mongoose.model('questions', Question)
