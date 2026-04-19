const passport = require('passport');
const localStratergy = require('passport-local').Strategy;
const User = require("../models/User.js");
const { find } = require('../models/User');

passport.use(
    new localStratergy(async (username, password, done) => {
        try{
            const user = await User.findOne({username});
            if(!user){
                return done(null, false, {message : "User not Found"});
            }

            const isMatch = await user.comparePassword(password); 

            if(!isMatch){
                return done(null, false, {message : "Wrong Password"});
            }

            return done(null, user);
        }catch(err){
            return done(err);
        }
    })
);

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser( async (id, done) =>{
    try{
        const user = await User.findById(id);
        done(null, user);
    }catch(err){
        done(err);
    }
});