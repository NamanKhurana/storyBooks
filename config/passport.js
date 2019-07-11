const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
//LOAD USER MODEL
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            // console.log(profile)
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            }

            //CHECK FOR EXISTING USER
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    done(null, user)
                } else {
                    new User(newUser)
                    .save()
                    .then(user => done(null,user))
                }
            })
        })
    )

    passport.serializeUser((user,done) => {
        done(null,user.id)
    })

    passport.deserializeUser((id,done) => {
        User.findById(id).then(user => done(null,user))
    })
}