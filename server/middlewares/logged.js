module.exports.isLoggedin = (req, res, next) =>{
    console.log(req.user);
    console.log("Auth:", req.isAuthenticated());
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({message : "Unauthroized"});
}