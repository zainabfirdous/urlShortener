const express = require("express");
const {
	detailedAliasAnalytics,
	topicAnalysis,
	overallAnalytics,
} = require("../controller/shortUrlAnalytics");
const { rateLimiting } = require("../middleware/Limiter");
const { authorizeUser } = require("../middleware/Authorization");

const analyser = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *   description: user can view alias-wise analytics, topic-based analysis and overall analysis of their short-urls
 */
/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *  get:
 *    summary: analysis of all short-urls in the given topic
 *    tags:
 *      - Analytics
 *    parameters:
 *    - in: path
 *      name: topic
 *      required: true
 *      content:
 *        application/json:
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: topic-based analysis like urls, totalClicks
 *      500:
 *        description: Internal server error
 *      401:
 *        description: Unauthorized
 *      429:
 *        description: consumed all points in the given time(5 points in 30 mins), rateLimiting
 */

analyser.get("/topic/:topic", authorizeUser, rateLimiting, async (req, res) => {
	try {
		const result = await topicAnalysis(req);
		res.status(200).send(result);
	} catch (err) {
		res.send(err);
	}
});

/**
 * @swagger
 * /api/analytics/overall:
 *  get:
 *    summary: analysis of all short-urls in the given topic
 *    tags:
 *      - Analytics
 *    responses:
 *      200:
 *        description: overall analysis like totalUrls, uniqueCLicks, totalClicks, osType, deviceType
 *      500:
 *        description: Internal server error
 *      401:
 *        description: Unauthorized
 *      429:
 *        description: consumed all points in the given time(5 points in 30 mins), rateLimiting
 */
analyser.get("/overall", authorizeUser, rateLimiting, async (req, res) => {
	try {
		const result = await overallAnalytics(req);
		res.status(200).send(result);
	} catch (err) {
		res.send(err);
	}
});

/**
 * @swagger
 * /api/analytics/{alias}:
 *  get:
 *    summary: analysis of short-url with the given alias
 *    tags:
 *      - Analytics
 *    parameters:
 *    - in: path
 *      name: alias
 *      required: true
 *      content:
 *        application/json:
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: analysis like totalClicks, osType, deviceType, clicksByDate
 *      500:
 *        description: Internal server error
 *      401:
 *        description: Unauthorized
 *      429:
 *        description: consumed all points in the given time(5 points in 30 mins), rateLimiting
 */
analyser.get("/:alias", authorizeUser, rateLimiting, async (req, res) => {
	try {
		const result = await detailedAliasAnalytics(req);
		res.status(200).send(result);
	} catch (err) {
		res.send(err);
	}
});

module.exports = { analyser };
