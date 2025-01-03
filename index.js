const express = require("express");
const passport = require("passport");
const session = require("express-session");
const app = express();
const path = require("path");
app.set("view engine", "ejs");

require('dotenv').config();
require("./googleAuth");


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//middleware
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
}

app.listen(3000, (req, res) => {
    console.log("Auth app started");
});

app.get("/", (req, res) => {
    res.sendFile("index.html")
});


app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => { res.redirect("/profile") });


app.get("/profile", isLoggedIn, (req, res) => {
    res.send(`Welcome ${req.user.displayName}`)
})



app.get("/auth/logout", (req, res) => {
    // req.logout(() => {
    //     res.redirect("/");
    // });
    req.session.destroy();
    res.redirect("/")

})


