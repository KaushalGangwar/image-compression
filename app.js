/**
	This is the main file in which http server is created and all requests are
	redirected to tere corresponding end points.
**/
"use strict";
const express = require("express");

/**
	morgan is the http request logger middleware for node js
**/

const logger = require("morgan");
/**
	Parse incoming request bodies in a middleware.
**/

const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const routes = require("./routes/index");
const logging = require('./logs/logger');


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", routes);


app.set("view engine", "jade");

http.createServer(app).listen(3012, function(error, response) {
	let port = 3012;
	if (error) {
		logging.error({}, {ERROR : 'Error while creating server :' + error.message});
	} else {
		logging.trace( {}, {SERVER : `Express server listening on port: ${port}` });
	}
});
