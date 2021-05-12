const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const commentModel = mongoose.model('comment', commentSchema)

module.exports = {
  commentSchema,
  commentModel
}
