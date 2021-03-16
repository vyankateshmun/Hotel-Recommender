var Comment = require('../models/comment');
var Hotel   = require('../models/hotel');
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'You must be signed in to do that!');
        res.redirect('/login');
    },
    checkUserHotel: function(req, res, next){
        Hotel.findById(req.params.id, function(err, foundHotel){
            if(err || !foundHotel){
                console.log(err);
            req.flash('error', 'Sorry, that hotel does not exist!');
            res.redirect('/hotels');
            } else if(foundHotel.author.id.equals(req.user._id) || req.user.isAdmin){
                req.hotel = foundHotel;
                console.log(req.user._id,req.user.isAdmin);
                next();
            } else {
                req.flash('error', 'You don\'t have permission to do that!');
                res.redirect('/hotels/' + req.params.id);
            }
        });
    },
    checkUserComment: function(req, res, next){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash('error', 'Sorry, that comment does not exist!');
                res.redirect('/hotels');
            } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                req.comment = foundComment;
                next();
            } else {
                req.flash('error', 'You don\'t have permission to do that!');
                res.redirect('/hotels/' + req.params.id);
            }
        });
    },
    isAdmin: function(req, res, next) {
        if(req.user.isAdmin) {
            next();
        } else {
            req.flash('error', 'This site is now read only thanks to spam and trolls.');
            res.redirect('back');
        }
    },
    isSafe: function(req, res, next) {
        next();
    }
}