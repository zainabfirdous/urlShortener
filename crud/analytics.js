const { analytics } = require("../models/analytics");
const moment = require("moment");
const { Op } = require("sequelize");

const analytics_findOne = async (cond) => {
	try {
		const result = await analytics.findOne({ where: cond });
		return result;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const analytics_create = async (record) => {
	try {
		const result = await analytics.create(record);
		return result;
	} catch (Err) {
		console.log(Err);
		throw Err;
	}
};

const analytics_findAll = async (cond) => {
	try {
		const result = await analytics.findAll({ where: cond });
		return result;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

//uses sequelize count function to create a count sql query
const count_analysis = async (cond) => {
	try {
		const result = await analytics.count(cond);
		return result;
	} catch (err) {
		throw err;
	}
};

//this function's only responsibility is to find date of analytics record and clicks in recent 7 days based on a cond
const clickByDates = async (field, value) => {
	try {
		//using moment to find the recent 7 days
		const todayDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const sevenDaysAgo = moment()
			.subtract(7, "days")
			.format("YYYY-MM-DD HH:mm:ss");

		//this function is used for alias and also topic analytics, so creating find query based on the field
		const dates =
			field === "topic"
				? await analytics.findAll({
						where: {
							topic: value,
							createdAt: {
								[Op.gte]: sevenDaysAgo,
							},
						},
				  })
				: await analytics.findAll({
						where: {
							shortId: value,
							createdAt: {
								[Op.gte]: sevenDaysAgo,
							},
						},
				  });

		let clicksArray = [];
		for (const item of dates) {
			let analysisObject = {};
			//checking if this date is already pushed into the array
			const existing_record = clicksArray.find((object) =>
				moment(object.date).isSame(item.dataValues.createdAt)
			);

			if (!existing_record) {
				//finds total clicks on a given date
				const clicks = await count_analysis({
					where: { createdAt: item.dataValues.createdAt },
				});
				analysisObject = {
					date: item.dataValues.createdAt,
					clicks: clicks,
				};
				clicksArray.push(analysisObject);
			}
		}
		return clicksArray;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

//this function's only responsibility is to find analytics based on OS such as uniqueclicks for a os etc
const osAnalysis = async (shortId) => {
	try {
		//finds all records of a shortUrl
		const analysisRecords = await analytics_findAll({
			shortId: shortId,
		});
		let osArray = [];
		for (records of analysisRecords) {
			let osAnalysisObject = {};
			//checks if this os details were already included in the array
			existing_record = osArray.find(
				(ob) => ob.osName === records.dataValues.os
			);
			if (!existing_record) {
				const [osCount, userCount] = await Promise.all([
					//finds unique count of given os
					count_analysis({
						distinct: true,
						col: "os",
						where: { os: records.dataValues.os },
					}),
					//finds unique users for a given os type
					count_analysis({
						distinct: true,
						col: "os",
						where: { uid: records.dataValues.uid },
					}),
				]);

				osAnalysisObject = {
					osName: records.dataValues.os,
					uniqueclicks: osCount,
					uniqueUser: userCount,
				};
				osArray.push(osAnalysisObject);
			}
		}
		return osArray;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

//this function's only responsibility is to find analytics based on deviceType such as uniqueclicks for a deviceType etc
const deviceAnalysis = async (shortId) => {
	try {
		//finds all records for a shortUrl
		const analysisRecords = await analytics_findAll({
			shortId: shortId,
		});
		let deviceArray = [];
		for (records of analysisRecords) {
			let deviceAnalysisObject = {};
			//checks if this deviceType was already pushed to array
			existing_record = deviceArray.find(
				(ob) => ob.deviceName === records.dataValues.deviceType
			);
			if (!existing_record) {
				const [deviceCount, userCount] = await Promise.all([
					//finds unique count of given deviceType
					count_analysis({
						distinct: true,
						col: "deviceType",
						where: { deviceType: records?.dataValues?.deviceType },
					}),
					//finds unique users for a given deviceType
					count_analysis({
						distinct: true,
						col: "deviceType",
						where: { uid: records?.dataValues?.uid },
					}),
				]);

				deviceAnalysisObject = {
					deviceName: records.dataValues.deviceType,
					uniqueClicks: deviceCount,
					uniqueUsers: userCount,
				};

				deviceArray.push(deviceAnalysisObject);
			}
		}

		return deviceArray;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports = {
	analytics_findOne,
	analytics_create,
	analytics_findAll,
	count_analysis,
	clickByDates,
	osAnalysis,
	deviceAnalysis,
};
