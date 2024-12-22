const express = require("express");
const validateRequest = require("../Validation");
const { createShortUrl, redirectShortUrl } = require("../controller/shortUrl");

const shorten = express.Router();

shorten.post("/", validateRequest("createForm"), async (req, res) => {
	try {
		const response = await createShortUrl(req, res);
		console.log("error in try");
		res.status(200).send(response);
	} catch (err) {
		res.status(err.status).send(err.message);
	}
});

shorten.get("/:alias", validateRequest("redirectForm"), async (req, res) => {
	try {
		const response = await redirectShortUrl(req, res);
		res.status(200).redirect(response);
	} catch (err) {
		console.log("error in route");
		res.status(err.status).send(err.message);
	}
});

module.exports = { shorten };
