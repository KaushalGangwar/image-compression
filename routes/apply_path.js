"use strict";

const Promise = require("bluebird");
const utils = require("./utility");
const jsonpatch = require("fast-json-patch");
const logging = require("../logs/logger");

/**
	This API applies JSON patch to the JSON object in req body
	@param {stream} req express req stream
	@param {stream} res express res stream 
**/
let logConf = {};
module.exports = {
	applyPatch
};
function applyPatch(req, res) {
	logging.trace(logConf, { REQUEST: req.body });
	let jsonObject = req.body.obj;
	let patchObject = req.body.patch_obj;
	let errors = jsonpatch.validate(patchObject, jsonObject);
	if (errors && errors.length) {
		let error = new Error("Invalid Patch");
		logging.error(logConf, { ERROR: error.message });
		utils.sendErrorResponse(res, error);
	}
	try {
		let modifiedObj = jsonpatch.applyPatch(jsonObject, patchObject);
		logging.trace(logConf, { PATCHED_DOC: modifiedObj });
		utils.sendSuccessResponse(
			res,
			"Patch applied successfully",
			modifiedObj
		);
	} catch (e) {
		let error = new Error("Error while applying Patch");
		logging.error(logConf, { ERROR: error.message });
		utils.sendErrorResponse(res, error);
	}
}
