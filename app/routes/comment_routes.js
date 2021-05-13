// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose models for posts and comments
const Post = require('../models/post')
const commentFile = require('../models/comment')
const Comment = commentFile.commentModel
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else

const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// CREATE
// POST /posts/:id/comments
router.post('/posts/:postId/comments', requireToken, (req, res, next) => {
  // set owner of new comment to be current user
  req.body.comment.owner = req.user.id
  req.body.comment.ownerEmail = req.user.email

  // req.params.id will be set based on the `:postId` in the route
  console.log(req.params.postId)
  Post.findById(req.params.postId)
    .then(handle404)
    // if `findById` is succesful, create a new comment and push it into the post's comments array
    .then(post => {
      Comment.create(req.body.comment)
      // if `create` is succesful, push the new comment into the post's comments array, then return the comment
        .then(comment => {
          post.comments.push(comment)
          post.save()
          res.status(201).json({ comment: comment.toObject() })
        })
        // if an error occurs, pass it off to our error handler
        // the error handler needs the error message and the `res` object so that it
        // can send an error message back to the client
        .catch(next)
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /posts/:postId/comments/:commentId
router.get('/posts/:postId/comments/:commentId', requireToken, (req, res, next) => {
  // req.params.commentId will be set based on the `:commentId` in the route
  Comment.findById(req.params.commentId)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "post" JSON
    .then(comment => res.status(200).json({ comment: comment.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /posts/:postId/comments/:commentId
router.delete('/posts/:postId/comments/:commentId', requireToken, (req, res, next) => {
  Post.findById(req.params.postId)
    .then(handle404)
    .then(post => {
      Comment.findById(req.params.commentId)
        .then(handle404)
        .then(comment => {
          // throw an error if current user doesn't own `example`
          requireOwnership(req, comment)
          // delete the comment ONLY IF the above didn't throw
          const indexToDelete = post.comments.findIndex(element => element._id.toString() === comment._id.toString())
          // console.log('indexToDelete ', indexToDelete)
          post.comments.splice(indexToDelete, 1)
          comment.deleteOne()
          post.save()
          res.sendStatus(204)
        })
        .catch(next)
    })
    // if an error occurs, pass it to the handler
    // send back 204 and no content if the deletion succeeded
    .catch(next)
})

// UPDATE
// PATCH /posts/:postId/comments/:commentId
router.patch('/posts/:postId/comments/:commentId', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the owner property by including a new
  // owner, prevent that by deleting these key/value pairs
  delete req.body.comment.owner
  delete req.body.comment.ownerEmail

  Post.findById(req.params.postId)
    .then(handle404)
    .then(post => {
      Comment.findById(req.params.commentId)
        .then(handle404)
        .then(comment => {
          // throw an error if current user doesn't own comment
          requireOwnership(req, comment)
          // update the comment ONLY IF the above didn't throw
          console.log('new', req.body)
          console.log('old', comment)
          comment.updateOne(req.body.comment)
          comment.save()
          post.save()
          console.log('updated', comment)
          return post
        })
        .then(() => res.sendStatus(204))
        .catch(next)
    })
})

// INDEX A POST
// GET /posts/:postId/comments
router.get('/posts/:postId/comments', requireToken, (req, res, next) => {
  Post.findById(req.params.postId)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "post" JSON
    .then(post => res.status(200).json({ comments: post.comments.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
