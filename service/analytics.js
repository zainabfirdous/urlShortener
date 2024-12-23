const { redis } = require("../config/redis_config");
const {
	count_analysis,
	clickByDates,
	osAnalysis,
	deviceAnalysis,
} = require("../crud/analytics");
const { findOne, findAll } = require("../crud/shortUrl");
const { BASE_URL } = require("../constant");

//create analytics for a given alias
const aliasAnalytics = async (req) => {
	try {
		//checks if details already exists in the redis
		const cacheResult = await redis.get(req.params.alias);
		if (cacheResult) {
			const cacheData = JSON.parse(cacheResult);
			return cacheData;
		} else {
			//finds shortUrl for the given alias
			const shortUrl = await findOne({ alias: req.params.alias });
			const shortUrlId = shortUrl.dataValues.shortId;
			const [totalClicks, uniqueClicks, clicksByDate, osType, deviceType] =
				await Promise.all([
					//total clicks for a given shortUrl
					count_analysis({
						where: {
							shortId: shortUrlId,
						},
					}),
					//unique users who clicked on shortUrl
					count_analysis({
						distinct: true,
						col: "uid",
						where: { shortId: shortUrlId },
					}),
					clickByDates("shortId", shortUrlId),
					osAnalysis(shortUrlId),
					deviceAnalysis(shortUrlId),
				]);

			const response_object = {
				totalClicks: totalClicks,
				uniqueClicks: uniqueClicks,
				clicksByDate: clicksByDate,
				osType: osType,
				deviceType: deviceType,
			};

			//stores data in redis for 30 mins, since the analytics is expected to change more often
			redis.set(req.params.alias, JSON.stringify(response_object), "EX", 1800);
			return response_object;
		}
	} catch (err) {
		throw err;
	}
};

//create analytics for a given topic
const topicAnalytics = async (req) => {
	try {
		const topic = req.params.topic;
		//checks if details exists in redis
		const cacheResult = await redis.get(topic);
		if (cacheResult) {
			const cacheData = JSON.parse(cacheResult);
			return cacheData;
		} else {
			//finds all shortUrls under a topic
			const allUrls = await findAll({ topic: topic });
			let urls = [];
			for (const url of allUrls) {
				let urlObject = {};
				const [totalClicks, uniqueUsers] = await Promise.all([
					//total clciks on a shortUrl
					count_analysis({
						where: {
							shortId: url.dataValues.shortId,
						},
					}),
					//unique users who clicked on url
					count_analysis({
						distinct: true,
						col: "uid",
						where: { shortId: url.dataValues.shortId },
					}),
				]);

				let shorturl = `${BASE_URL}/${url.dataValues.alias}`;

				urlObject = {
					shortUrl: shorturl,
					totalClicks: totalClicks,
					uniqueUsers: uniqueUsers,
				};

				urls.push(urlObject);
			}
			const [totalClicks, uniqueClicks, clicksByDate] = await Promise.all([
				//total clicks based on topic
				count_analysis({
					where: { topic: topic },
				}),
				//unique users who interacted with urls based on the given topic
				count_analysis({
					distinct: true,
					col: "uid",
					where: { topic: topic },
				}),
				clickByDates("topic", topic),
			]);

			const response_object = {
				totalClicks: totalClicks,
				uniqueClicks: uniqueClicks,
				clicksByDate: clicksByDate,
				urls: urls,
			};

			redis.set(topic, JSON.stringify(response_object), "EX", 3600);
			return response_object;
		}
	} catch (err) {
		throw err;
	}
};

module.exports = { aliasAnalytics, topicAnalytics };
