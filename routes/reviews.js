const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const { Review, validateReview} = require('../models/review');
const { User } = require('../models/user');
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const reviews = await Review.find();
    res.send(reviews)
});

router.post('/', auth, async (req, res) => {
    const { error } = validateReview(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if(!user) return res.status(400).send('Invalid user.');

    let review = new Review({
        content: req.body.content,
        user: {
            _id: user._id,
            username: user.username
        }
    });
    review = await review.save();
    res.send(review)
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validateReview(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const review = await Review.findByIdAndUpdate(req.params.id, { content: req.body.content},{
        new: true
    })

    if(!review) return res.status(404).send('The review was not found');

    res.send(review)
});


router.get('/:id', async (req, res) => {
    const review = await Review.findById(req.params.id)
    if(!review) return res.status(404).send('The review was not found');
    res.send(review);
});


router.delete('/:id', auth, async (req, res) => {
    const review = await Review.findByIdAndRemove(req.params.id)
    if(!review) return res.status(404).send('The review was not found');
    res.send(review)
});


module.exports = router
