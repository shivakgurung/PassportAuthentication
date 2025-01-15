// import passport from "passport";
// import { Strategy } from "passport-local"
// import userList from "../Data/userList.js"

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userList = require("../Data/userList.js");
const { users } = require('../model/index.js');
const bcrypt = require("bcryptjs");
const { where } = require('sequelize');


users.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});
//for signup
passport.use(
    'signup',
    new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            console.log('check 1')
            try {
                console.log('check 2')
                const { username } = req.body;
                if (!email || !username || !password) {
                    return done(null, false, { message: "please fill email, username, password" });
                }
                const user = await users.findOne({ where: { email: email } });
                if (user) {
                    return done(null, false, { message: "user with that email already exists" });
                }
                console.log(`email is ${email}, password is ${password}, username is ${username}`)
                const userCreated = await users.create({ username, email, password });
                return done(null, userCreated, { message: "User created successfully" });
            } catch (err) {
                return done(err);
            }
        }
    )
);


//new Strategy is an object with 3 properties: username, password and passReqToCallback
// export default 
//for login
passport.use('login', new Strategy({ usernameField: "email" },
    async (email, password, done) => {
        console.log("inside passport local stratum")
        console.log(` email is ${email}, password is ${password}`)
        try {
            const userExists = await users.findOne({
                where: {
                    email: email,
                },
            });
            console.log(`userExists is ${userExists?.email}`)
            if (userExists) {
                const isMatch = bcrypt.compareSync(password, userExists.password);
                console.log(`isMatch is ${isMatch}`)
                if (isMatch) {
                    return done(null, userExists, { message: "Logged in successfully" })
                }
                else {
                    console.log("invalid credentials")
                    return done(null, false, { message: "Invalid Credentials" })
                }
            }
            else {
                return done(null, false, { message: "Invalid credentials" })
            }

        }
        catch (err) {
            return done(err, false, { message: "Server Error" })
        }
    }
))


passport.serializeUser((user, done) => {
    // Save user id in session
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Find user by id and pass it to done
    const user = userList.find(user => user.id === id);
    done(null, user || false);
});