const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash')
const { User, validateUser} = require('../models/user')
const auth = require('../middleware/auth') //authorization
const admin = require('../middleware/admin');

//add [auth, admin]
router.get('/', [auth, admin], async (req, res) => {
    const users = await User.find();
    res.send(users)
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne( { username: req.body.username })
    if( user ) return res.status(400).send('User is already registered')

    user = new User(_.pick(req.body, [
     'username', 'firstName','lastName',
     'email', 'phoneNo', 'password'
    ]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'firstName', 'lastName', 'email', 'phoneNo']));
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

module.exports = router
