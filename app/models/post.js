const mongoose = require('mongoose')
const commentSchema = require('./comment')

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
}, {
  timestamps: true
})

module.exports = mongoose.model('post', postSchema)
