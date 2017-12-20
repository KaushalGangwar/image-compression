/**
	This file contains all the utility functions 
	which are used repeatedly.
**/
"use strict";
module.exports = {
	checkBlank,
	sendErrorResponse,
	sendSuccessResponse
};

/**
	To check if mandatory fields are empty.
	@param {array}  Array of mandatory fields.
**/

function checkBlank(arr) {
	for (let i in arr) {
		if (arr[i] === "" || arr[i] === undefined || arr[i] === null) {
			return true;
			break;
		}
	}
	return false;
}

/**
	Send error response.
	@param {object}  error Object
	@param {stream}  res   express res stream 
**/

function sendErrorResponse(res, error) {
	if (!error || !error.message) {
		error = new Error("Something went wrong.");
	}
	return res.send({
		message: error.message,
		success: false
	});
}

/**
	Send success response to user.
	@param {String} message string
	@param {Object} data    token
	@param {stream} res     express res stream   
**/
function sendSuccessResponse(res, message, data) {
	let responseObj = {
		message: message,
		data: data,
		success: true
	};
	return res.send(responseObj);
}
