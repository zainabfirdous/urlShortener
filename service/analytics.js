const { redis } = require("../config/redis_config");
const {
	count_analysis,
	clickByDates,
	osAnalysis,
	deviceAnalysis,
} = require("../crud/analytics");
const { findOne } = require("../crud/shortUrl");

const aliasAnalytics = async (req) => {
	try {
		const cacheResult = await redis.get(req.params.alias);
		if (cacheResult) {
			const cacheData = JSON.parse(cacheResult);
			console.log(cacheData);
			return cacheData;
		} else {
			const shortUrl = await findOne({ alias: req.params.alias });
			const shortUrlId = shortUrl.dataValues.shortId;
			const [totalClicks, uniqueClicks, clicksByDate, osType, deviceType] =
				await Promise.all([
					count_analysis({
						where: {
							shortId: shortUrlId,
						},
					}),
					count_analysis({
						distinct: true,
						col: "uid",
						where: { shortId: shortUrlId },
					}),
					clickByDates(shortUrlId),
					osAnalysis(shortUrlId),
					deviceAnalysis(shortUrlId),
				]);

			console.log(totalClicks);

			const response_object = {
				totalClicks: totalClicks,
				uniqueClicks: uniqueClicks,
				clicksByDate: clicksByDate,
				osType: osType,
				deviceType: deviceType,
			};

			console.log(response_object);
			redis.set(req.params.alias, JSON.stringify(response_object), "EX", 3600);
			return response_object;
		}
	} catch (err) {
		throw err;
	}
};

module.exports = { aliasAnalytics };
