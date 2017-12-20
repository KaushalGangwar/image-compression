"use strict";

const Promise = require("bluebird");
const jimp = require("jimp");
const fs = require("fs");
const utils = require("./utility");
const request = require("request");
const logging = require("../logs/logger");

module.exports = {
	compressImage,
	fetchImageData,
	compressionLogic,
	readFile
};

function compressImage(req, res) {
	logging.trace({}, { REQUEST : req.body});

	let url = req.body.url;
	let mandatoryVal = [url];

	if (utils.checkBlank(mandatoryVal)) {
		let error = new Error("Image url is not available");
		logging.error({}, { ERROR: error.message });
		return utils.sendErrorResponse(res, error);
	}

	let extension = url.slice(url.toString().lastIndexOf("."));
	let filePath = __dirname + "/images/" + Date.now() + extension;

	Promise.coroutine(function*() {
		yield fetchImageData(url, filePath);
		yield compressionLogic(filePath);
		let data = yield readFile(filePath);
		return data;
	})()
		.then(data => {
			res.setHeader("Content-Type", "image/jpg");
			return res.send(data);
		})
		.catch(error => {
			logging.error({}, { ERROR: error.message });
			utils.sendErrorResponse(res, error);
		});
}

function readFile(filepath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (error, result) => {
			if (error) {
				logging.error({}, { ERROR: error.message });
				reject(error);
			}
			return resolve(result);
		});
	});
}
function compressionLogic(filePath) {
	return new Promise((resolve, reject) => {
		jimp.read(filePath, (error, image) => {
			if (error) {
				logging.error({}, { ERROR: error.message });
				return reject(error);
			}
			image.resize(50, 50).write(filePath);
			return resolve();
		});
	});
}

function fetchImageData(url, filePath) {
	return new Promise(function(resolve, reject) {
		request
			.get(url)
			.on("error", error => reject(error))
			.pipe(fs.createWriteStream(filePath))
			.on("close", () => resolve());
	});
}
