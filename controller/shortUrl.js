const { createUrl, redirectUrl } = require("../service/url");

const createShortUrl = async (req, res) => {
	try {
		const url = await createUrl(req);
		return url;
	} catch (err) {
		return err;
	}
};

const redirectShortUrl = async (req, res) => {
	try {
		console.log(req.params.alias);

		const originalUrl = await redirectUrl(req);
		console.log("error in try c");
		return originalUrl;
	} catch (err) {
		console.log("error in controller");
		throw err;
	}
};

module.exports = {
	createShortUrl,
	redirectShortUrl,
};
