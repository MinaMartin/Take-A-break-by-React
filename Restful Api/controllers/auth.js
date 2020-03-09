const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const User = require("../models/user");
const Jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed");
        error.stausCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let user;
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            user = new User({
                email: email,
                password: hashedPassword,
                name: name
            })
            return user.save()
        })
        .then(response => {
            console.log(response);
            res.status(201).json({
                message: "User Signed up Successfully",
                userId: user._id
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
/************************************************************************************************* */
exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed");
        error.stausCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    let userInDb;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error("Email Cannot Be Found, Check Your Input");
                error.stausCode = 401;
                throw error;
            }
            userInDb = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Wrong Password");
                error.stausCode = 401;
                throw error;
            }
            const token = Jwt.sign(
                { email: userInDb.email, userId: userInDb._id.toString(), expirationTime: '1 hour' },
                'MoviesSecretAndItIsSoLong', { expiresIn: '1h' });
            res.status(200).json({ message: "User Logged in Successfully", token: token, userId: userInDb._id.toString() })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

