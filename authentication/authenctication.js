"use strict";

const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const utils = require("../routes/utility");
const constants = require("../routes/constants");
const logging = require('../logs/logger');

exports.validateAccessToken = validateAccessToken;
exports.verifyToken = verifyToken;

/** This API validates access token of user
	@param {Stream} req express req stream
	@param {Stream} res express res stream
	@param {Function} next Pass control to next handler
**/

function validateAccessToken(req, res, next) {
	logging.trace({}, {REQUEST : req.body });
	let accessToken = req.body.access_token;
	let mandatoryValues = [accessToken];
	if (utils.checkBlank(mandatoryValues)) {
		let error = new Error("Access token is not present");
		logging.error({}, {ERROR: error.message});
		next(error);
	}
	Promise.coroutine(function*() {
		yield verifyToken(accessToken);
	})()
		.then(() => {
			next();
		})
		.catch(error => {
			next(error);
		});
}

/**	This function verifies the access token 
	using the jsonwebtoken module decode method
	@param {String} accessToken String which is decoded using secret key
**/

function verifyToken(accessToken) {
	return new Promise((resolve, reject) => {
		jwt.verify(
			accessToken,
			constants.secretKey.secret,
			(error, decoded) => {
				if (error) {
					logging.error({}, {ERROR: error.message});
					return reject(error);
				}
				if (!decoded) {
					return reject(new Error("Invalid token"));
				}
				return resolve();
			}
		);
	});
}
