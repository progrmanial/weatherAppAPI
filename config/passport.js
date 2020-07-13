const JwtS = require("passport-jwt").Strategy;
const JwtE = require("passport-jwt").ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model("users");
const keys = require("../config/keys")


const opts = {};
opts.jwtFromRequest = JwtE.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtS(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
}