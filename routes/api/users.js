const exp = require("express");
const rt = exp.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ky = require("../../config/keys");
const fetch = require('node-fetch');
const hat = require('hat');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load the User model
const User = require("../../models/User");


// @route POST api/users/register
// @desc Register User
// @access Public
rt.post("/register", (req, res) => {
    // Form validation
    const{ error, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(error);
    }

    User.findOne({ email: req.body.email }).then(user =>{
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }else {
            // const hash = hat();
            const newUser = new User({
                api_key: hat(),
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            const userResponse = {
                                name: user.name,
                                api_key: user.api_key,
                                email: user.email
                            };
                            res.json(userResponse);
                        })
                        .catch(err => console.log(err))
                });
            });
        }
    })
});

// 
// @route POST api/users/login
// @desc Authenticate User
// @access Public
rt.post("/login", (req, res) => {
    // Validate form
    const { error, isValid } = validateLoginInput(req.body);

    // Check for validity
    if (!isValid) {
        return res.status(400).json(error);
    }

    const email = req.body.email;
    const pass = req.body.password;

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        bcrypt.compare(pass, user.password)
            .then(isMatch => {
                if (isMatch) {
                    // Valid User
                    // Create JWT Payload
                    const payload = {
                        token: user.api_key,
                        name: user.name,
                        api_key: user.api_key
                    };

                    // Sign Token
                    jwt.sign(
                        payload,
                        ky.secretOrKey,
                        {
                            expiresIn: 31556925 // One Year
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                // token: "Bearer " + token,
                                api_key: payload.api_key
                            });
                        }
                    );
                }else{
                    return res
                        .status(400)
                        .json({ passwordincorrect: "Password incorrect"});
                }
        });
    });
});

rt.get("/api", (req, res) => {
    const token = req.query.api_key;
    const city = req.query.city;

    // console.log(token);
    // console.log( city);
    // res.json({req});

    User.findOne({ api_key: token }).then(user => {
        if (!user) {
            res.json({invalidToken: "API key is not valid!"});
        }else{
            const url = "http://api.weatherstack.com/current?access_key=16a09b0a91d82224e804074e09dc0291&query=" + city;
            const setting = {method: "Get"};


            fetch(url, setting)
            .then(response => response.json())
            .then(data => {

                res.json({data});
            })
        }

    });
});

module.exports = rt;