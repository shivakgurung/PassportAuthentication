// import express from "express";
// import passport from "passport";
// import session from "express-session";
// import path from "path"
// import userList from "./Data/userList";
// const LocalStrategy = require("passport-local").Strategy;


const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const userList = require("./Data/userList");

require("./model/index");
const { users } = require("./model/index");



const app = express();
app.set("view engine", "ejs");

require('dotenv').config();
require("./authStrategies/googleAuth");
require("./authStrategies/local-strategy");

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//middleware
const isLoggedIn = (req, res, next) => {
    req.user || req.session.user ? next() : res.sendStatus(401);
}

app.listen(3000, (req, res) => {
    console.log("Auth app started");
});


app.get("/", (req, res) => {
    res.sendFile("index.html")
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,//if true, it will save the session even if there is no data to save
    saveUninitialized: false, //if true, it will save the session even if there is no data to save
    cookie: { secure: false }//allows even http requests; not limited to only https
}))

app.use(passport.initialize())
app.use(passport.session())
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => { res.redirect("/profile") });

app.get("/profile", isLoggedIn, (req, res) => {

    res.send(`Welcome ${req?.user?.displayName}`)

})

// app.post("/login", (req, res) => {
//     const { email, password } = req.body;
//     const user = userList.find(user => user.email === email && user.password === password);
//     if (user) {
//         req.session.user = user.id;
//         return res.send("Logged in successfully")
//     }
//     res.send("Invalid credentials");
// })

app.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.send("please fill email, username, password");
    }
    const user = await users.findOne({ where: { email: email } });
    if (user) {
        return res.send("user already exists");
    }

    await users.create({
        email: email,
        username: username,
        password: bcrypt.hashSync(password, 12),
    });
    res.send("user created successfully");

})

passport.serializeUser((user, done) => {
    // Save user id in session
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Find user by id and pass it to done
    const user = userList.find(user => user.id === id);
    done(null, user || false);
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.redirect("/profile")
})

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log("session is", session)
    })
    return req.session.user ? res.send(`User id: ${req.session.user}`) : res.status(401).send({ message: "Not Authenticated" });
    //send(req.session.user) will send error because req.session.user is being interpreted as the status code for the response rather than the response body
    // return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({ message: "Not Authenticated" });
})


app.get("/logout", (req, res) => {
    // req.logout(() => {
    //     res.redirect("/");
    // });
    req.session.destroy();
    res.redirect("/")
})


