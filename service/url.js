const { nanoid } = require("nanoid");
const { BASE_URL } = require("../constant");
const { analytics_create } = require("../crud/analytics");
const { findOne, create } = require("../crud/shortUrl");
const { redis } = require("../config/redis_config");
const useragent = require("useragent");
const axios = require("axios");

const createUrl = async (req) => {
	try {
		const { longUrl, customAlias = "", topic = "" } = req.body;
		const { uid } = req.userDetails;
		//checking if the user had already created short-url and saved in redis
		const cachedData = await redis.get(customAlias);
		if (cachedData) {
			const cacheResult = JSON.parse(cachedData);
			return {
				shortUrl: `${BASE_URL}/${cacheResult.alias}`,
				createdAt: cacheResult.createdAt,
			};
		} else {
			//checking if the user had already created short-url more than an hour ago since redis only stores key for 1hr
			const existingUrl = await findOne({ originalUrl: longUrl });
			let shortUrlRecord = {};

			if (!existingUrl) {
				//creating a alias if customAlias was not provided
				const id = nanoid(8);
				const shortId = customAlias?.length ? customAlias : id;

				shortUrlRecord = await create({
					originalUrl: longUrl,
					alias: shortId,
					topic: topic,
					uid: uid,
				});
				//setting the shortUrl details in redis for 1 hour since the user may click on shorturl
				redis.set(
					shortId,
					JSON.stringify(shortUrlRecord.dataValues),
					"EX",
					3600
				);
				return {
					shortUrl: `${BASE_URL}/${shortId}`,
					createdAt: shortUrlRecord.dataValues.createdAt,
				};
			} else {
				//if short-url already exists in db setting it in redis and returning it
				redis.set(
					existingUrl.dataValues.alias,
					JSON.stringify(existingUrl.dataValues),
					"EX",
					3600
				);
				return {
					shortUrl: `${BASE_URL}/${existingUrl.dataValues.alias}`,
					createdAt: existingUrl.dataValues.createdAt,
				};
			}
		}
	} catch (err) {
		throw err;
	}
};

const redirectUrl = async (req) => {
	try {
		//getting the alias from params
		const alias = req.params.alias;

		//getting os, deviceType, ipAddress from headers
		const agent = useragent.parse(req.headers["user-agent"]);
		const os = agent.os.toString();
		const deviceType = agent.device.toString();
		const ipAddress = req.headers["x-forwarded-for"] || null;

		//fetching geolocation using geojs
		const response = await axios.get(
			`https://get.geojs.io/v1/ip/geo/${ipAddress}.json`
		);
		const lat = response.data.latitude;
		const long = response.data.longitude;

		let analyticsRecord = {
			os: os,
			deviceType: deviceType,
			ipAddress: ipAddress,
			latitude: lat,
			longitude: long,
		};

		//checking the same cache as one set during createUrl in case user wantes to check redirect feature
		const cachedData = await redis.get(alias);
		if (cachedData) {
			const cacheResult = JSON.parse(cachedData);
			analyticsRecord = {
				...analyticsRecord,
				shortId: cacheResult.shortId,
				createdBy: cacheResult.createdBy,
				topic: cacheResult.topic,
				clickedAt: new Date(),
			};

			await analytics_create(analyticsRecord);
			return cacheResult.originalUrl;
		} else {
			//finding shortUrl in db and returning the longUrl to controller
			const existingUrl = await findOne({ alias: alias });

			analyticsRecord = {
				...analyticsRecord,
				shortId: existingUrl.dataValues.shortId,
				createdBy: existingUrl.dataValues.uid,
				topic: existingUrl.dataValues.topic,
				clickedAt: new Date(),
			};

			await analytics_create(analyticsRecord);
			return existingUrl.dataValues.originalUrl;
		}
	} catch (err) {
		const error = new Error("Something went wrong!!");
		error.details = err;
		error.status = 500;
		throw error;
	}
};

module.exports = {
	createUrl,
	redirectUrl,
};
