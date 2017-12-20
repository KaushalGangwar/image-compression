/** This file handles login, generation of access token and
	verification of access token of user.
**/

"use strict";

const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const secretKey = "Kaushal";
const utils = require("./utility");
const logging = require('../logs/logger');

module.exports = {
	loginUser,
	generateToken
};
/** 
	API to Login user and generate access token using JSON Web Token.
	@param {Stream} req express request stream
	@param {Stream} res express response stream
**/

function loginUser(req, res) {
	logging.trace({}, {REQUEST : req.body});
	let userId = req.body.user_id;
	let password = req.body.password;
	let mandatoryValues = [userId, password];

	if (utils.checkBlank(mandatoryValues)) {
		let error = new Error("User Id or password is missing");
		utils.sendErrorResponse(res, error);
	}

	Promise.coroutine(function*() {
		let accessToken = yield generateToken(userId, password);
		return accessToken;
	})()
		.then(token => {
			utils.sendSuccessResponse(res, "Login successful", token);
		})
		.catch(error => {
			logging.error({}, {ERROR: error.message});
			utils.sendErrorResponse(res, error);
		});
}

/**
	This Function generates access token
	@param {String} userId Login id of user
	@password {Strng} password Password of user
**/

function generateToken(userId, password) {
	return new Promise((resolve, reject) => {
		/* 		
			This payload is encrypted using the secret key which is later used for authentication
		*/
		let payload = {
			data: password
		};

		jwt.sign(payload, secretKey, (error, token) => {
			if (error) {
				return reject(error);
			}
			if (!token) {
				return reject(
					new Error("Something went wrong while generating token")
				);
			}
			return resolve(token);
		});
	});
}
