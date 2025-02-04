if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const routerListings = require("./routes/listing.js")
const routerReviews = require("./routes/review.js")
const routerUser = require("./routes/user.js")
const User = require('./model/user.js');

// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
const db_URL = process.env.ATLASDB

main().then(()=>{
    console.log("connected succesfull")
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(db_URL)
}

app.use(
    cors({
      origin: 'http://localhost:5173', // Frontend URL
      credentials: true, // Allow credentials (cookies)
    }))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const store = MongoStore.create({
    mongoUrl : db_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION")
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

// Middle for session
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/listings/auth', (req, res) => {
    res.json({ user: req.isAuthenticated() ? req.user : null });
  });

app.use("/listings", routerListings)
app.use("/listings/:id/reviews", routerReviews)
app.use("/", routerUser)

app.all("*", (req, res , next)=>{
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next)=>{
    let {statusCode =500, message="something went wrong"} = err;
    res.status(statusCode).json(message)
});

app.listen(8080, ()=>{
    console.log("Server is listening to port")
})




