const { aliasAnalytics } = require("../service/analytics");

const detailedAliasAnalytics = async (req) => {
	try {
		console.log("inside controller");
		const response = await aliasAnalytics(req);
		return response;
	} catch (err) {
		throw err;
	}
};

module.exports = { detailedAliasAnalytics };
