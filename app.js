var express         = require("express"),       //Framework
    app             = express(),
    bodyParser      = require("body-parser"),   //To read body and parse into JSON object
    mongoose        = require("mongoose"),      //Makes mongodb working easier
    passport        = require("passport"),      //Used for authentication
    cookieParser    = require("cookie-parser"),
    LocalStrategy   = require("passport-local"),    //Session based authentication
    flash           = require("connect-flash"),     //Display error and success messages
    Hotel           = require("./models/hotel"),    //Hotel Schema  
    Comment         = require("./models/comment"),  //Comment Schema    
    User            = require("./models/user"),     //User Schema
    session         = require("express-session"),
    seedDB          = require("./seeds"),           //Clear all data if required
    methodOverride  = require("method-override");   //To override methods
// configure dotenv
//require('dotenv').load();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    hotelRoutes      = require("./routes/hotels"),
    indexRoutes      = require("./routes/index")
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/hotel" ,function(error){
    if(error) 
        console.log(error);
},{useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});//Database
app.use(bodyParser.urlencoded({extended: true}));   //All data is parsed into body
app.set("view engine", "ejs");      //Ejs is the language used (Embedded Javascript Templates)
app.use(express.static(__dirname + "/public")); //Serves all files in public directory
app.use(methodOverride('_method'));     //Use put and delete
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({	//middleware
	secret:"I am pro coder",
	resave: false,
	saveUninitialized : false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});
app.get("/",function(req,res){
  res.render("landing");
});

app.use("/", indexRoutes);
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments", commentRoutes);

app.set('port',( process.env.PORT || 3000));
app.listen(app.get( 'port' ), function(){
  console.log("Server is running on " + app.get( 'port' ));
});