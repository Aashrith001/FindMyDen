var express    = require("express"),
	app        = express(),
	bodyparser = require("body-parser"),
	mongoose   = require("mongoose"),
	flash      = require("connect-flash"),
	passport   = require("passport"),
	localStatergy = require("passport-local"),
	methodOverride = require("method-override"),
	Comment    = require("./models/comment"),
	campground = require("./models/campground"),
	User       = require("./models/user"); 

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
    indexRoutes		 =  require("./routes/index");


mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser : true});


app.use(bodyparser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
	secret : "this is highly confidential",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error     = req.flash("error");
	res.locals.success   = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,function(){
	console.log("YelpCamp server has started");
});
