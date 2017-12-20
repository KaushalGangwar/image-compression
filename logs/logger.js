"use strict";
const stack = require("callsite");
const colors = require("colors");
var PrettyError = require("pretty-error");
var pe = new PrettyError();

exports.trace = trace;
exports.error = error;

var levels = {
	trace: 0,
	error: 1
};

colors.setTheme({
	trace: "bgGreen",
	error: "bgRed"
});

const defaultConfig = {
	loggingEnabled: true,
	defaultLoggingLevel: "trace",
	utcDelay: 330,
	showFileName: true,
	showFunctionName: true,
	showLineNumber: true
};
/**
 *   Main function to display logs in console
 *   @param {Number} loggingLevel    displays the logging level
 *   @param {Object} loggingParameters 1st argument is config object
 *                                   from locally called function.
 *                                   Rest all needs to be printed
 **/

function log(loggingLevel, loggingParameters) {
	let stackObj = stack();

	let execConfig = defaultConfig;
	let localConfig = loggingParameters["0"];
	delete loggingParameters["0"]; //delete the first argument i.e localConfig.

	Object.keys(execConfig).map(key => {
		if (localConfig[key] === undefined) {
			localConfig[key] = execConfig[key];
		}
	});

	printLoggingParameters(
		localConfig,
		loggingLevel,
		loggingParameters,
		stackObj
	);
}

function printLoggingParameters(
	execConfig,
	loggingLevel,
	loggingParameters,
	stackObj
) {
	Object.keys(loggingParameters).forEach(index => {
		let output = "";

		let defaultLoggingLevel = levels[execConfig.defaultLoggingLevel];
		if (
			(loggingLevel < defaultLoggingLevel ||
				execConfig.loggingEnabled === false) &&
			loggingLevel !== levels.error
		) {
			return;
		}
		output += showFileName(execConfig, stackObj);
		output += showFunctionName(execConfig, stackObj);
		output += showLineNumber(execConfig, stackObj);

		if (loggingParameters[index] instanceof Error) {
			var renderedError = pe.render(loggingParameters[index]);
			output += renderedError;
		} else if (typeof loggingParameters[index] === "object") {
			output += JSON.stringify(loggingParameters[index]);
		} else {
			output += loggingParameters[index];
		}
		if (loggingLevel === levels.error) {
			process.stderr.write(output);
		} else {
			process.stdout.write(output);
		}
	});
}

function showFileName(execConfig, stackObj) {
	if (!execConfig.showFileName) {
		return "";
	}
	let fileName = "\n" + stackObj[2].getFileName().replace(__dirname + "/", "");
	return colors.green(fileName + ":");
}

function showFunctionName(execConfig, stackObj) {
	if (!execConfig.showFunctionName) {
		return "";
	}
	let functionName = stackObj[2].getFunctionName() || "anonymous";
	return colors.green(functionName + "");
}

function showLineNumber(execConfig, stackObj) {
	if (!execConfig.showFileName) {
		return "";
	}
	let lineNumber = stackObj[2].getLineNumber();
	return colors.italic(" at line: " + lineNumber + "  ==>  ");
}

function trace(/* arguments */) {
	log(levels.trace, arguments);
}

function error(/* arguments */) {
	log(levels.error, arguments);
}
