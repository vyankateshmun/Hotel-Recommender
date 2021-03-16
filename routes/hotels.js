var express = require("express");
var router  = express.Router();
var Hotel = require("../models/hotel");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');
/*const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'google',
  apiKey: 'AIzaSyD-51C_PUdBBlN-He_bGyrfUc0XOScgCPE', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
 
const geocoder1 = NodeGeocoder(options);*/
 
var { isLoggedIn, checkUserHotel, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all hotels
router.get("/", function(req, res){
    if(req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all hotels from DB
        Hotel.find({name: regex}, function(err, allHotels){
            if(err){
                console.log(err);
            }else {
                res.status(200).json(allHotels);
            }
        });
    } else {
      // Get all hotels from DB
        Hotel.find({}, function(err, allHotels){
            if(err){
                console.log(err);
            } else {
                if(req.xhr) {
                    res.json(allHotels);
                } else {
                    res.render("hotels/index",{hotels: allHotels, page: 'hotels'});
                }
            }
        });
    }
});

//CREATE - add new hotel to DB
router.post("/", isLoggedIn, isSafe, function(req, res){
      // get data from form and add to hotels array
    var name = req.body.name;
    var starrating = req.body.starrating;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var cost = req.body.cost;
    var location = req.body.location;
    var count = 0;
    var userrating = 5;
    var newHotel = {name: name, starrating: starrating, image: image, userrating: userrating, count: count, description: desc, cost: cost, author:author, location: location, lat: '18.922', lng: '72.833'};
    // Create a new hotel and save to DB
    Hotel.create(newHotel, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash('error', 'Sorry, Hotel cannot be created successfully ');
            return res.redirect('/hotels');
        } else {
            res.redirect("/hotels");
        }
    });
});

//NEW - show form to create new hotel
router.get("/new", isLoggedIn, function(req, res){
   res.render("hotels/new"); 
});

// SHOW - shows more info about one hotel
router.get("/:id", function(req, res){
    //find the hotel with provided ID
    Hotel.findById(req.params.id).populate("comments").exec(function(err, foundhotel){
        if(err || !foundhotel){
            console.log(err);
            req.flash('error', 'Sorry, that hotel does not exist!');
            return res.redirect('/hotels');
        }
        //render show template with that hotel
        res.render("hotels/show", {hotel: foundhotel});
    });
});

// EDIT - shows edit form for a hotel
router.get("/:id/edit", isLoggedIn, checkUserHotel, function(req, res){
    //render edit template with that hotel
    res.render("hotels/edit", {hotel: req.hotel});
});

// PUT - updates hotel in the database
router.put("/:id", isSafe, function(req, res){  
    var newData = {name: req.body.name, starrating: req.body.starrating, image: req.body.image, description: req.body.description, cost: req.body.cost, location: req.body.location, lat: '18.922', lng: '72.833'};
    Hotel.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, hotel){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/hotels/" + hotel._id);
        }
    });
});

// DELETE - removes hotel and its comments from the database
router.delete("/:id", isLoggedIn, checkUserHotel, function(req, res) {
    Comment.remove({
      _id: {
        $in: req.hotel.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.hotel.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'hotel deleted!');
            res.redirect('/hotels');
          });
      }
    })
});

module.exports = router;

