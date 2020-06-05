var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
	campground.find({},
	function(err,camps){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{camps:camps});
		}
	});
});
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("../views/campgrounds/new");
});
router.get("/:id",function(req,res){
	campground.findById(req.params.id).populate("comments").exec(function(err,campinfo){
		if(err){
			console.log(err);
		}
		else{
			res.render("show",{campground:campinfo});
		}
	});
});

router.get("/:id/edit",middleware.checkCampgroundOwner,function(req,res){
		campground.findById(req.params.id,function(err,foundCampground){
			res.render("../views/campgrounds/edit",{campground : foundCampground});
		});
});

router.put("/:id",middleware.checkCampgroundOwner,function(req,res){
	campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/:id",middleware.checkCampgroundOwner,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newcamp = {name: req.body.name ,price:req.body.price,img: req.body.image,description:req.body.desc,author : author};
	campground.create(newcamp,function(err,newcreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;