const express = require('express')
const router = express.Router()
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth')
const Story = require('../models/Story')
//Stories Index
router.get('/', (req, res) => {

    Story.find({ status: 'public' })
        .populate('user')
        .sort({ date: 'desc' })
        .then(stories => res.render('stories/index', {
            stories: stories
        }))
})

//Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findById(req.params.id)
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if (story.status == 'public') {
                res.render('stories/show', {
                    story: story
                })
            } else {
                if (req.user) {
                    if (req.user.id == story.user._id) {
                        res.render('stories/show', { story: story })
                    } else {
                        res.redirect('/stories')
                    }
                } else {
                    res.redirect('/stories')
                }
            }
        })
})

//List stories from a particular user
router.get('/user/:userId', (req, res) => {
    Story.find({ user: req.params.userId, status: 'public' })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            })
        })
})

//List stories from a particular user
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            })
        })
})


//Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add')
})

//Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findById(req.params.id)
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/stories')
            } else {
                res.render('stories/edit', {
                    story: story
                })
            }
        })
})

//Process add story
router.post('/', (req, res) => {
    let allowedComments

    if (req.body.allowedComments) {
        allowedComments = true
    } else {
        allowedComments = false
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowedComments: allowedComments,
        user: req.user.id
    }

    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`)
        })

})

//Edit Form 
router.put('/:id', (req, res) => {
    Story
        .findById(req.params.id)
        .then(story => {

            let allowedComments

            if (req.body.allowedComments) {
                allowedComments = true
            } else {
                allowedComments = false
            }

            //New values
            story.title = req.body.title,
                story.body = req.body.body,
                story.status = req.body.status,
                story.allowedComments = allowedComments

            story.save()
                .then(story => {
                    res.redirect('/dashboard')
                })
        })
})

//DELETE STORY
router.delete('/:id', (req, res) => {
    Story.deleteOne({ _id: req.params.id })
        .then(() => res.redirect('/dashboard'))
})

//ADD COMMENT
router.post('/comment/:id', (req, res) => {
    Story.findById(req.params.id)
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }

            story.comments.unshift(newComment)
            story.save()
                .then(story => res.redirect(`/stories/show/${story.id}`))

        })
})

module.exports = router