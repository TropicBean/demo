const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user")

require("dotenv").config()

//Mogoose strategy
passport.use(User.createStrategy())
/*
// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/
//Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  callbackURL: process.env.DEFAULT_URL + "/auth/google/callback",
  passReqToCallback : true 
}, authUser))

// Check if the google user exists on our db , if not we'll create a record 
function authUser(request, accessToken, refreshToken, profile, done) {
  //check if user exists on our own db 
  User.findOne({googleId : profile.id }).then(currentuser => {
    if(currentuser){
      //user exists
      console.log("Google user is :", currentuser)
      done(null,currentuser)
    }else{
      //not found ,create user in db
      new User({
        googleId:profile.id,
        username: profile.displayName,
        thumbnail: profile._json.image.url 
      }).save().then(newUser => {
        console.log("Created new user" , newUser)
        done(null, newUser)
      })
    }
  })
}

passport.serializeUser( (user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done (null, user)
}) 

module.exports =  passport 