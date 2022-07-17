const mongoose = require('mongoose')
const Joi = require('joi');
//const reviewSchema = require('./review')

const Company = mongoose.model('Company', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    sector: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    // review: {
    //     type: reviewSchema,
    //     required: true,
    // },
    // numberOfReviews: {
    //     type: Number,
    //     required: true,
    //     min: 0,
    //     max: 250
    // },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 250
    }
}));

function validateCompany(company) { //clients send to api
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        sector: Joi.string().min(2).max(30).required(),
        //reviewId: Joi.string().required(),
        //numberOfReviews: Joi.number().min(0).required(),
        description: Joi.string().min(2).max(250).required(),
    });
    return schema.validate(company);
};

exports.Company = Company;
exports.validateCompany = validateCompany
