const mongoose = require('mongoose')
const commentFile = require('./comment')
const comment = commentFile.commentSchema

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
  comments: [comment]
}, {
  timestamps: true
})

module.exports = mongoose.model('post', postSchema)
