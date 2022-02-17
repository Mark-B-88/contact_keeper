const bcrypt = require('bcryptjs/dist/bcrypt')
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const User = require('../models/User')

/**
 *      @route      POST api/users
 *      @desc       Register a user
 *      @access     Public
 */
router.post('/', [
    check('name', 'Please add name!').not().isEmpty(),
    check('email', 'Please include a valid email!').isEmail(),
    check('password', 'Please enter a password with 6 or more characters!')
        .isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })

        // if user already exists
        if(user) {
            return res.status(400).json({ mgs: 'User already exists!' })
        }

        // create new user
        user = new User({
            name,
            email,
            password
        })

        // encrypt the password
        const salt = await bcrypt.genSalt(10)
        // hash the password
        user.password = await bcrypt.hash(password, salt)

        // save the password
        await user.save()

        res.send('User Saved!')

    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

module.exports = router