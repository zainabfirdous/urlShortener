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
const clickByDates = async (cond) => {
	try {
		//using moment to find the recent 7 days
		const todayDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const sevenDaysAgo = moment()
			.subtract(7, "days")
			.format("YYYY-MM-DD HH:mm:ss");

		//adding createdAt condition to the given cond
		const search = {
			...cond,
			createdAt: {
				[Op.gte]: sevenDaysAgo,
			},
		};

		//finding all records based on the given cond
		const dates = await analytics_findAll(search);

		let clicksArray = [];
		for (const item of dates) {
			let analysisObject = {};
			//checking if this date is already pushed into the array
			const existing_record = clicksArray.find((object) =>
				moment(object.date).isSame(item.dataValues.clickedAt)
			);

			if (!existing_record) {
				//finds total clicks on a given date
				const clicks = await count_analysis({
					where: {
						clickedAt: item.dataValues.clickedAt,
					},
				});
				analysisObject = {
					date: item.dataValues.clickedAt,
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
const osAnalysis = async (cond) => {
	try {
		//finds all records of a shortUrl
		const analysisRecords = await analytics_findAll(cond);
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
						where: {
							uid: records.dataValues.uid,
							uid: {
								[Op.ne]: "Other",
							},
						},
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
const deviceAnalysis = async (cond) => {
	try {
		//finds all records for a shortUrl
		const analysisRecords = await analytics_findAll(cond);
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
						where: {
							uid: records?.dataValues?.uid,
							uid: {
								[Op.ne]: "Other",
							},
						},
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
