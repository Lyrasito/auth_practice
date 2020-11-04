const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');
const { verify } = require('jsonwebtoken');

router.post('/register', async(req, res, next) => {
 
    try {
        const {email, password} = req.body
        const result = await authSchema.validateAsync(req.body)

        
        const doesExist = await User.findOne({email: result.email})
        if(doesExist) {
            throw createError.Conflict(`${result.email} has already been registered`)
        }
        const user = new User(result)
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)
        res.send({accessToken, refreshToken})
    }
    catch(err) {
        if(err.isJoi) {
            err.status = 422;
        }
        next(err);
    }
})

router.post('/login', async(req, res, next) => {
    console.log(User);
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email: result.email})

        if(!user) {
            throw createError.NotFound('user not registered')
        }

        const isMatched = await user.isValidPassword(result.password)
        if(!isMatched) {
            throw createError.Unauthorized('Username/password not valid')
        }
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id)
        res.send({accessToken, refreshToken})
    } catch(err) {
        if(err.isJoi) {
            return next(createError.BadRequest("Invalid username or password"))
        }
        next(err)
    }
})

router.post('/refresh-token', async(req, res, next) => {
    try {
        const {refreshToken} = req.body

        if(!refreshToken) {
            throw createError.BadRequest()
        }
        const userId = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userId);
        const newRefreshToken = await signRefreshToken(userId);
        res.send({ accessToken: accessToken, refreshToken: newRefreshToken })
    } catch(err) {
        next(err)
    }
})

router.delete('/logout', async(req, res, next) => {
    res.send('logout route')
})

module.exports = router;