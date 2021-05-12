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

/*

// SHOW
// GET /posts/:id
router.get('/posts/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Post.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "post" JSON
    .then(post => res.status(200).json({ post: post.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /post/
router.delete('/posts/:id', requireToken, (req, res, next) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(example => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, example)
      // delete the example ONLY IF the above didn't throw
      example.deleteOne()
    })
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    // send back 204 and no content if the deletion succeeded
    .catch(next)
})

// UPDATE
// PATCH /posts/:id
router.patch('/posts/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` or `comments` properties by including a new
  // owner or comments, prevent that by deleting those key/value pairs
  delete req.body.post.owner
  delete req.body.post.comments

  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, post)

      // pass the result of Mongoose's `.update` to the next `.then`
      return post.updateOne(req.body.post)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX
// GET /posts
router.get('/posts', requireToken, (req, res, next) => {
  Post.find()
    .then(posts => {
      // `posts` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return posts.map(post => post.toObject())
    })
    // respond with status 200 and JSON of the posts
    .then(posts => res.status(200).json({ posts: posts }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW USER
// GET /users/:id
router.get('/users/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Post.find({ owner: req.params.id })
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "post" JSON
    .then(posts => {
      // `posts` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return posts.map(post => post.toObject())
    })
    .then(posts => res.status(200).json({ posts: posts }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

*/

module.exports = router
