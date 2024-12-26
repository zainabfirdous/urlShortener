const { rateLimiter } = require("../config/rate_limiter_config");

const rateLimiting = async (req, res, next) => {
	try {
		const { uid } = req.userDetails;
		await rateLimiter.consume(uid);
		next();
	} catch (err) {
		const error = new Error("Too many requests, please try again later");
		error.status = 429;
		next(error);
	}
};

module.exports = { rateLimiting };
