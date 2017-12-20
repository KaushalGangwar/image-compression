"use strict";
module.exports = function(err, req, res, next) {
	let code = err.status || 500;
	let response = {};
	response.message = err.message || "Something went wrong";
	response.success = false;
	res.status(code).json(response);
};
