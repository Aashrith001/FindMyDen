var express = require("express");
var router = express.Router({mergeParams : true});
var campground = require("../models/campground"),
	Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new",middleware.isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("../views/comments/new",{campground:campground});	
		}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	var comment = req.body.comment;
	campground.findById(req.params.id,function(err,campground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			Comment.create(comment,function(err,newComment){
				if(err){
					req.flash("error","uh ooh !! something went wrong");
					res.redirect("/campgrounds");
				}else{
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					campground.comments.push(newComment);
					campground.save();
					req.flash("success","Successfully Added Comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("../views/comments/edit",{campground_id : req.params.id,comment : foundComment});			
		}
	});
});

router.put("/:comment_id",middleware.checkCommentOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.render("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/:comment_id",middleware.checkCommentOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

module.exports = router;