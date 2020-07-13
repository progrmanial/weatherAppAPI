// Load express, mongoose and body-parser
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");

const app = express();


app.use(
	bodyParser.urlencoded({
		extended: false
	})
); 

app.use(bodyParser.json());

// DB Configuration
const db = require("./config/keys").mongoURI;

mongoose
	.connect(
		db, {useNewUrlParser: true}
	)
	.then(
		() => console.log("MongoDb Successfully Connected!")
		)
	.catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Configuration
require("./config/passport")(passport);

// Routes
app.use("/", users);
// app.use("/", users);


// serving static asset in production

if (process.env.NODE_ENV === "production") {
	// Set Static folder
	app.use(express.static('clt/build'));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "clt", "build", "index.html"));
	});
}

// Getting the heroku port or a custom port
const port = process.env.PORT || 5000; 

// Starting the Server
app.listen(port, () => console.log(`Server up and running >>>>`));