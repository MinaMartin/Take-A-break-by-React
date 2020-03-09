const express = require('express');
const { body } = require('express-validator');
const authcontroller = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post('/signUp',
    [
        body('email').isEmail().withMessage("Invalid Email Address ")
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            console.log("User Found");
                            return Promise.reject('Email Already Exists');
                        }
                    })
            }),
        body('password', 'Password Must Be at least 5 charachters and 12 charachters at maximum')
            .trim().isLength({ min: 5, max: 12 }),
        body('confirmedPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Both Passwords Must Be Equal');
                }
                return true;
            }),
        body('name', "Name Cannot be Empty").trim().notEmpty()
    ],
    authcontroller.signUp);

router.post('/login',
    [
        body('email').isEmail().withMessage("Invalid Email Address ")
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (!user) {
                            //console.log("User Found");
                            return Promise.reject('No User with this email');
                        }
                    })
            }),
        body('password', 'Password Must Be at least 5 charachters and 12 char at maximum')
            .trim().isLength({ min: 5, max: 12 })
    ],
    authcontroller.login);

module.exports = router;