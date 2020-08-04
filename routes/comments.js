var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurants");
var Comment = require("../models/comment");


router.get("/new",isLoggedIn, function(req,res){
    Restaurant.findById(req.params.id, function(err,restaurant){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {restaurant:restaurant});
        }
    });
    
});

router.post("/",isLoggedIn, function(req, res){
    Restaurant.findById(req.params.id, function(err,restaurant){
        if(err){
            console.log(err);
            res.redirect("/restaurants");
        } else  {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect("/restaurants");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    restaurant.comments.push(comment);
                    restaurant.save();
                    res.redirect('/restaurants/' + restaurant._id);
                }
            })
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;