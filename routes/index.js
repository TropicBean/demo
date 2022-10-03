var express = require('express');
var bcrypt = require('bcrypt')
var router = express.Router();
var userModel = require('../models/user')
const { authenticate } = require('passport');
const passport = require('../bin/passportconfig');
const connectEnsureLogin = require('connect-ensure-login');// authorization

/* GET home page. */
router.get('/',passport.authenticate('local', {failureRedirect: '/login'}), function(req, res, next) {
  res.render('index.ejs', { name : 'Karl'});
});
//
router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req,res) =>{

 res.render('dashboard.ejs')

 console.log("done rendering dashboard")
})

//login
router.get('/login' , (req,res)=>{
  res.render('login.ejs')
})

router.post('/login' , passport.authenticate('local', {failureRedirect: '/login'}), (req,res)=>{
  console.log(req.user, "Successfully logged in")
  res.redirect('/dashboard')
})

//register
router.get('/register' , (req,res)=>{
  res.render('register.ejs')
})

router.post('/register' , async (req,res)=>{
  
  const username = req.body.username ,
        password = req.body.password 
        
  try{
    // Find one 
    const user = await userModel.findOne({ username: username }).exec();

    if(user){
      res.render("register.ejs", {message: `User already exists with username: ${username}, please try again`})

      return;
    }
  } catch(e){
    console.log(e)
    res.render("register.ejs", {message : "Something went wrong , please try again"})

    return
  }     
  try{
    const newUser = userModel.register({username: username}, password )

    if(newUser){
      res.render("login.ejs" , {message : "User registered successfully ,please log in"})
    }

  } catch(e){
    console.log(e)
  }

})

// Route to Log out
router.get('/logout', function(req, res) {

  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  })

  
});

//
/* GET users listing. */
router.get('/auth/google', passport.authenticate('google', { scope: [ 'profile' ]}));


router.get('/auth/google/callback', passport.authenticate( 'google', {
   successRedirect: '/dashboard',
   failureRedirect: '/login'
}));

router.get('/auth/google/success' , (req,res) => {
  res.render("dashboard.ejs")
})

module.exports = router;



