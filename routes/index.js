const express = require('express');
const router = express.Router();
const userModel = require('../models/user')
const passport = require('../bin/passportconfig');
const connectEnsureLogin = require('connect-ensure-login'); // authorization

//Try to route default route to dashboard or login
router.get('/',passport.authenticate('local', {failureRedirect: '/login' }), function(req, res, next) {
  res.render('dashboard.ejs')
});

router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req,res) =>{

  res.render('dashboard.ejs')
})

//home
router.get('/home' , (req,res)=>{
  
  var msgerror = req.query.msg;


  res.render('home.ejs')

})


//login
router.get('/login' , (req,res)=>{
  
  var msgerror = req.query.msg;

  if(msgerror == "true"){
    res.render('login.ejs', {message : "Invalid login details , please ensure the username/password is correct"})
  } else{
    res.render('login.ejs')
  }
})

router.post('/login' , passport.authenticate('local', {failureRedirect: '/login?msg=true'}), (req,res)=>{
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
    const newUser = await userModel.register({username: username}, password )

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


// Google passport routing
router.get('/auth/google', passport.authenticate('google', { scope: [ 'profile' ]}));

router.get('/auth/google/callback', passport.authenticate( 'google', {
   successRedirect: '/dashboard',
   failureRedirect: '/login'
}));


module.exports = router;



