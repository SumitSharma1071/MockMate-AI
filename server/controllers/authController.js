const User = require('../models/User');
const ExpressError = require('../config/ExpressError');
const wrapAsync = require('../config/Wrapasync')
const session = require('express-session');

module.exports.register = wrapAsync(async (req, res, next) =>{
    const {firstname, lastname, username, password, email} = req.body;
    const existingUser = await User.findOne({username});
    if(existingUser){
        throw new ExpressError('User already exist', 400);
    }    
    const user = new User({firstname, lastname, username, password, email});
    await user.save();
    res.locals.data = {user};
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: { id: user._id, username: user.username }
    });
});

module.exports.login = wrapAsync(async(req, res, next) =>{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        throw new ExpressError('Invalid username or password', 400);
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        throw new ExpressError('Invalid username or password', 400);
    }
    req.login(user, (err) =>{
        if(err){
           return next(new ExpressError('Login Failed', 500));
        }
        res.locals.data = {user};
        res.status(201).json({
        success: true,
        message: 'User logged in successfully',
        user: { id: user._id, username: user.username }
    });
    });
});

module.exports.logout = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
           return next(new ExpressError("logout Failed", 500));
        }

         req.session.destroy((err) => {
            if (err) {
                return next(new ExpressError('Session destroy failed', 500));
            }

        res.clearCookie("connect.sid");
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
      });
    });
};

module.exports.me = (req, res) =>{
    if(req.isAuthenticated()){
        return res.json({user : req.user});
    }
    res.status(401).json({message : "Not logged in"});
}