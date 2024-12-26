const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const axios = require("axios");
const { decode } = require("../helper/jwtTokens");

const tokenVerify = async (req, res, next) => {
	try {
		const { accessToken } = req.body;
		const client_id = process.env.CLIENT_ID;

		const client = new OAuth2Client(client_id);

		const response = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		req.userDetails = response.data;
		next();
	} catch (err) {
		const error = new Error(`error while google-signin: ${err}`);
		error.status = 401;
		next(error);
	}
};

const authorizeUser = async (req, res, next) => {
	try {
		let token = req.headers["authorization"];
		//throwing unauthorized error if token doesnt exists
		if (!token) {
			const error = new Error("you are not authorized to perform this action");
			error.status = 401;
			next(error);
		}
		//removinf bearer from token
		let accessToken = token.split(" ")[1];
		const verifyToken = await decode(accessToken);
		if (verifyToken !== null) {
			//setting token payload in req
			req.userDetails = verifyToken;
			next();
		} else {
			const error = new Error("you are not authorized to perform this action");
			error.status = 401;
			next(error);
		}
	} catch (err) {
		console.log(err);
		const error = new Error("you are not authorized to perform this action");
		error.status = 401;
		next(error);
	}
};

module.exports = { tokenVerify, authorizeUser };
