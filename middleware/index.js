
var middlewareObj = {};
var campground = require("../models/campground"),
	Comment = require("../models/comment");

middlewareObj.checkCampgroundOwner = function(req,res,next){
	if(req.isAuthenticated()){
		campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				req.flash("error","uh ooh !! something went wrong");
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}
	else{
		req.flash("error","You Need To Logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}
	else{
		req.flash("error","You Need To Logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You Need To Logged in to do that");
	res.redirect("/login");
}


module.exports = middlewareObj;