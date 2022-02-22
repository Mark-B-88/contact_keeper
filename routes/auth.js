const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs/dist/bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')

/**
 *      @route      GET api/auth
 *      @desc       Get logged in user
 *      @access     Private
 */
router.get('/', auth, async (req, res) => {
    try {
        // return user info, except the encrypted password
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

/**
 *      @route      POST api/auth
 *      @desc       Auth user & get token
 *      @access     Public
 */
router.post('/', [
    check('email', 'Please include a valid email!').isEmail(),
    check('password', 'Password is required!').exists()
],async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        // if invalid email
        if(!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' })
        }

        // check the password
        const isMatch = await bcrypt.compare(password, user.password)

        // if invalid password
        if(!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' })
        }

        // json web-token, set the payload
        const payload = {
            user: {
                id: user.id
            }
        }

        // json web-token, sign the web-token
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600 // expires in one hour
        }, (err, token) => {
            if(err) throw err
            res.json({ token })
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router