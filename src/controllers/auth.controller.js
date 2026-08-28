const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;



async function registerUser(req, res) {

    const { username, password, email } = req.body;

    try {
        // Check user exist or not
        const isUserExist = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (isUserExist) {
            return res.status(409).json({
                message: 'User already exists'
            })
        }

        // Paassword hashing
        const salt = await bcrypt.genSaltSync(saltRounds);
        const hashedPassword = await bcrypt.hashSync(password, salt);

        // Create new user
        const newUser = await userModel.create({
            username,
            password: hashedPassword,
            email
        });

        // Generate JWT token 
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.cookie('token', token);


        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        })

    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }

}


module.exports = { registerUser };
