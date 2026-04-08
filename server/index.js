require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const successhandler = require('./config/successHandler');
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const executeRoute = require('./routes/execute');
const path = require('path');
require('./config/Passport');

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "../client/mockmate/build")))

// My session
const sessionObject = {
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl : process.env.MONGO_URL
    }),
    cookie : {
        secure : false,
        sameSite: "lax",
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}
app.use(session(sessionObject));

// Passsport Initializtion
app.use(passport.initialize());
app.use(passport.session());

// Mongoose Connection
const main =  async () =>{
        await mongoose.connect(process.env.MONGO_URL);
}
main()
.then(() =>{
    console.log("MongoDb Connected Succefully");
})
.catch((err) =>{
    console.log(err);
})

// flash

// Routes
app.get("/test", (req, res) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
     res.send(req.user || "No user");
});
app.use('/api/auth', authRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/execute', executeRoute);
// Error
app.use(successhandler);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong"
  });
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});