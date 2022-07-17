const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash')
const { User} = require('../models/user')

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users)
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne( { email: req.body.email })
    if(!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken();
    res.send(token)

});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findByIdAndUpdate(req.params.id, { 
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNo: req.body.phoneNo
    },{
        new: true
    })

    if(!user) return res.status(404).send('The user was not found');

    res.send(user)
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send('The user was not found');
    res.send(user);
});


router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if(!user) return res.status(404).send('The user was not found');
    res.send(user)
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(req);
};

module.exports = router
