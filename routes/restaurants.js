var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurants");
//var Comment = require("../models/comment");

router.get("/", function(req,res){
    
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log(err);
        } else{
            res.render("restaurants/index",{restaurants:allRestaurants, currentUser: req.user});
        }
    });
    //
});

router.post("/",isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    }
    var newRestaurant = {name:name, image:image, description:description, author:author};
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/restaurants");
        }
    })
    //res.redirect("/restaurants");
});

router.get("/new",isLoggedIn, function(req,res){
    res.render("restaurants/new");
});

router.get("/:id", function(req,res){
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        } else {
            //console.log(foundRestaurant);
            res.render("restaurants/show", {restaurant: foundRestaurant});
        }
    });
    
});
//Edit rest
router.get("/:id/edit",checkRestaurantOwnership, function(req, res){

    
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
    
                    res.render("restaurants/edit", {restaurant: foundRestaurant});
              
                
            })
     


    
    
});

//Update  resrt
router.put("/:id",checkRestaurantOwnership, function(req, res){
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});

// Delete campground
router.delete("/:id",checkRestaurantOwnership, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkRestaurantOwnership(req, res, next){
    if(req.isAuthenticated()){
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
            if(err){
                res.redirect("back");
            } else {
                if(foundRestaurant.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }

}

module.exports = router;0