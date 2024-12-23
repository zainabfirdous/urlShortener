const { aliasAnalytics, topicAnalytics } = require("../service/analytics");

const detailedAliasAnalytics = async (req) => {
	try {
		const response = await aliasAnalytics(req);
		return response;
	} catch (err) {
		throw err;
	}
};

const topicAnalysis = async (req) => {
	try {
		const response = await topicAnalytics(req);
		return response;
	} catch (err) {
		throw err;
	}
};

module.exports = { detailedAliasAnalytics, topicAnalysis };
