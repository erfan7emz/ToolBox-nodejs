const mongoose = require('mongoose')
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            username: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 30
            },
        }),
        required: true,
    },
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 150
    }
})

const Review = mongoose.model('Review', reviewSchema);

function validateReview(review) { //clients send to api
    const schema = Joi.object({
        userId: Joi.objectId().required(),
        content: Joi.string().min(2).max(150).required(),
    });
    return schema.validate(review);
};

exports.Review = Review;
exports.validateReview = validateReview
exports.reviewSchema = reviewSchema
