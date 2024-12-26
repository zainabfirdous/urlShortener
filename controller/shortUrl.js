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
		const originalUrl = await redirectUrl(req);
		return originalUrl;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	createShortUrl,
	redirectShortUrl,
};
