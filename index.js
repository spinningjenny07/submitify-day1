/*jshint esversion:6*/

// require express
var express = require("express");

// run express
var app = express();

// set port to dynamically set port, or 8000
const PORT = process.env.port || 8000;

// bring in what we `module.export`ed from Project.js
var Project = require("./Project.js");

// bring in what we `module.export`ed from Storage.js
var Storage = require("./Storage.js");

// create our storage object
var storage = new Storage();

// Create two test projects, so we have some data on the frontend.
// Todo: remove this for production!
storage.addProject(
	new Project("Test", "Testing a project", "Me")
);

storage.addProject(
	new Project("Test 2", "Testing another project", "You")
);

// give us req.body for post requests
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// sets up a handler to respond to a GET request for "/" (site root)
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// sets up a handler to respond to a GET request for /api/projects
// responds with, as JSON, all of the projects currently in storage.
app.get("/api/projects", (req, res) => {
	storage.getAllProjects((projects) => {
		res.send(projects);
	});
});

// sets up a handler to respond to a POST request to /api/project
// responds with, as JSON, the new project as it exists in the storage
// (i.e. with the author and votes fields filled in)
app.post("/api/project", (req, res) => {
	var p = new Project(
		req.body.name,
		req.body.description,
		"TODO"
	);
	storage.addProject(p, () => {
		res.send(p);
	});
});

app.post("/api/vote", (req, res) => {
	console.log("VOTE:", req.body.name);
	storage.getProjectByName(req.body.name, (proj) => {
		var voted = proj.addVote("erty");
		res.send({
			voted: voted,
			voted: proj.getVoteCount()
		});
	});
	
});

// serve anything in the "public" directory without changes
// note the lack of "/"
app.use(express.static('public'));

// 404 handler
app.use((req, res, next) => {
	res.status(404);
	res.send("404 - File Not Found");
});

// 500 error handler
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500);
	res.send("500 - Internal Server Error.\n<br />CHECK YOUR TERMINAL!");
});

// listen for new connections!
app.listen(PORT, () => {
	console.log("Listening on port " + PORT);
});
