var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
const middleware = require("../middleware");
const { isLoggedIn, checkUserComment, isAdmin } = middleware;

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = false;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/hotels"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/hotels",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Hotel Recommender!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/hotels");
});

/*
router.get("/predictor", isLoggedIn, function(req, res){
   res.render("predictor"); 
});

router.post("/predictor", isLoggedIn, function(req, res){
    var starRating = req.body.starrating;
    var swimming = req.body.swimming;
    if(swimming==='Yes')
        swimming=1;
    else
        swimming=0;
    var tourist = req.body.tourist;
    if(tourist==='Yes')
        tourist=1;
    else
        tourist=0;
    var holiday = req.body.holiday;
    if(holiday==='Yes')
        holiday=1;
    else
        holiday=0;
    var breakfast = req.body.breakfast;
    if(breakfast==='Yes')
        breakfast=1;
    else
        breakfast=0;

    req.flash("success", "Successfully predicted the Price!");
    res.redirect("/hotels");
});*/


module.exports = router;