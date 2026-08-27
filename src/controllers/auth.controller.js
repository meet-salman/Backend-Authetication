const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {

    const { username, password, email } = req.body;

    const isEmailExist = await userModel.findOne({ email });
    const isUsernameExist = await userModel.findOne({ username });

    if (isEmailExist) {
        return res.status(409).json({
            message: 'Email already exists'
        })
    }

    if (isUsernameExist) {
        return res.status(409).json({
            message: 'Username already exists'
        })
    }

    const newUser = await userModel.create({ username, password, email });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.cookie('token', token);

    res.status(201).json({
        message: 'User registered successfully',
        user: newUser
    })



}


module.exports = { registerUser };
