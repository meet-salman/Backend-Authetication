const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function registerUser(req, res) {

    let { username, password, email } = req.body;

    // Validate input fields
    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        typeof email !== 'string' ||
        username.trim() === '' ||
        password === '' ||
        email.trim() === ''
    ) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }



    // Validate username length and format
    const usernameRegex = /^(?=.{10,12}$)(?!.*_.*_)(?!.*\..*\.)[a-z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            message: 'Username must be exactly 10 characters long and contain only lowercase letters, numbers, _ or .'
        });
    }

    // Validate password strength and length
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!strongPasswordRegex.test(password)) {
        // Node.js Controller Response
        return res.status(400).json({
            message: 'Password must be at least 8-15 characters long.<br />Password must contain at least:<br />- one uppercase letter<br />- one lowercase letter<br />- one number<br />- one special character'
        });

    }

    // Normalize input data by trimming whitespace
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email format'
        })
    }





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
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await userModel.create({
            username,
            password: hashedPassword,
            email
        });

        // Generate JWT token 
        const token = jwt.sign({ id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '5d' }
        );
        res.cookie('token', token);


        res.status(201).json({
            message: 'User registered successfully',
            newUser: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })

    }
    catch (error) {
        console.error('Error registering user:', error)

        res.status(500).json({
            message: 'Internal server error',
        })
    }

}

module.exports = { registerUser };
