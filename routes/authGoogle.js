const express = require("express");
const authGoogle = express.Router();
const { signInUser, signUpUser } = require("../controller/auth");
const Validation = require("../middleware/Validation");
const { tokenVerify } = require("../middleware/Authorization");
/**
 * @swagger
 * tags:
 *   - name: Auth
 *   description: user registration and login via googleAPI
 */
/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Sign in using Google and generate a JWT token
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              accessToken:
 *                type: string
 *                description: Google OAuth access token
 *    responses:
 *      200:
 *        description: Successful login
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
authGoogle.post(
	"/login",
	Validation("accForm"),
	tokenVerify,
	async (req, res) => {
		try {
			const result = await signInUser(req);
			//setting accessToken in header
			res.setHeader("Authorization", `Bearer ${result.accessToken}`);
			res.status(200).send(result.message);
		} catch (err) {
			if (err.status === 404) {
				res.status(404).send(err.message);
			}
			res.status(500).send("something went wrong please try again later");
		}
	}
);

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: Sign up using Google and generate a JWT token
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              accessToken:
 *                type: string
 *                description: Google OAuth access token
 *    responses:
 *      200:
 *        description: Successful registration
 *      409:
 *        description: User already registeered
 *      500:
 *        description: Internal server error
 */
authGoogle.post(
	"/register",
	Validation("accForm"),
	tokenVerify,
	async (req, res) => {
		try {
			const result = await signUpUser(req);
			//setting accessToken in header
			res.setHeader("Authorization", `Bearer ${result.accessToken}`);
			res.status(200).send(result.message);
		} catch (err) {
			if (err.status === 409) {
				res.status(409).send(err.message);
			}
			res.status(500).send("something went wrong please try again later");
		}
	}
);

module.exports = { authGoogle };
