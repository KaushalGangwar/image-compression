const express = require("express");
const router = express.Router();
const users = require("./users");
const authentication = require("../authentication/authenctication");
const imageComp = require("./image_compress");
const patch = require("./apply_path");
const error = require("./error");
/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", { title: "Express" });
});

router.post("/login_user", users.loginUser);
router.post(
	"/compress_image",
	authentication.validateAccessToken,
	imageComp.compressImage,
	error
);
router.post(
	"/patch",
	authentication.validateAccessToken,
	patch.applyPatch,
	error
);
module.exports = router;
