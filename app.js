var express          = require("express");
var app              = express();
var bodyParser       = require("body-parser")
const mongoose       = require('mongoose');
var passport         = require("passport");
var LocalStrategy    = require("passport-local");
var methodOverride   = require("method-override");
var Restaurant       = require("./models/restaurants")
var Comment          = require("./models/comment")
var User             = require("./models/user");
var seedDB           = require("./seeds");

var commentRoutes    = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurants"),
    authRoutes       = require("./routes/index");

//seedDB();

const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useUnifiedTopology: true,useNewUrlParser: true})
    .then(()=> console.log('Mongo DB connected'))
    .catch(err => console.log());

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "ora ora ora",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( function(req, res, next ) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/",authRoutes);
app.use("/restaurants/:id/comments",commentRoutes);
app.use("/restaurants", restaurantRoutes);

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));