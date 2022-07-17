const Joi = require('joi');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const config = require('config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 30
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    phoneNo: {
        type: String,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(2).max(30).required(),
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        email: Joi.string().required().email(),
        phoneNo: Joi.string().max(20),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
};

exports.User = User
exports.validateUser = validateUser
exports.userSchema = userSchema