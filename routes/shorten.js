const express = require("express");
const validateRequest = require("../middleware/Validation");
const { authorizeUser } = require("../middleware/Authorization");
const { rateLimiting } = require("../middleware/Limiter");
const { createShortUrl, redirectShortUrl } = require("../controller/shortUrl");

const shorten = express.Router();
/**
 * @swagger
 * tags:
 *   - name: ShortenUrl
 *   description: user can create short-url, and when someone triggers the short-url, he/she is redirected to original-url
 */
/**
 * @swagger
 * /api/shorten/:
 *  post:
 *    summary: create a short-url
 *    tags:
 *      - ShortenUrl
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              longUrl:
 *                type: url
 *                description: original-url for which short-url is being created
 *              customAlias:
 *                type: string
 *                description: alias name to be given to the original-url
 *              topic:
 *                type: string
 *                description: topic under which short-url belongs, default value Other
 *    responses:
 *      200:
 *        description: short-url created successfully
 *      500:
 *        description: Internal server error
 *      401:
 *        description: Unauthorized
 *      429:
 *        description: consumed all points in the given time(5 points in 30 mins), rateLimiting
 */
shorten.post(
	"/",
	authorizeUser,
	rateLimiting,
	validateRequest("createForm"),
	async (req, res) => {
		try {
			const response = await createShortUrl(req, res);
			res.status(200).send(response);
		} catch (err) {
			res.status(err.status).send(err.message);
		}
	}
);

/**
 * @swagger
 * /api/shorten/{alias} :
 *  get:
 *    summary: redirect to original-url
 *    tags:
 *    - ShortenUrl
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
 *        description: redirected successfully
 *      500:
 *        description: Internal server error
 *      401:
 *        description: Unauthorized
 *      429:
 *        description: consumed all points in the given time(5 points in 30 mins), rateLimiting
 */
shorten.get("/:alias", validateRequest("redirectForm"), async (req, res) => {
	try {
		const response = await redirectShortUrl(req, res);
		res.status(200).redirect(response);
	} catch (err) {
		console.log(err);
		res.status(err.status).send(err.message);
	}
});

module.exports = { shorten };
