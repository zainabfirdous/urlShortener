const express = require("express");
const {
	detailedAliasAnalytics,
	topicAnalysis,
} = require("../controller/shortUrlAnalytics");

const analyser = express.Router();

analyser.get("/:alias", async (req, res) => {
	try {
		const result = await detailedAliasAnalytics(req);
		res.status(200).send(result);
	} catch (err) {
		res.send(err);
	}
});

analyser.get("/topic/:topic", async (req, res) => {
	try {
		const result = await topicAnalysis(req);
		res.status(200).send(result);
	} catch (err) {
		res.send(err);
	}
});

module.exports = { analyser };
