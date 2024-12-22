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

const count_analysis = async (cond) => {
	try {
		console.log(cond);
		const result = await analytics.count(cond);
		console.log(`query result ${result}`);
		return result;
	} catch (err) {
		throw err;
	}
};

const clickByDates = async (id) => {
	try {
		const todayDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const sevenDaysAgo = moment()
			.subtract(7, "days")
			.format("YYYY-MM-DD HH:mm:ss");

		const dates = await analytics.findAll({
			where: {
				shortId: id,
				createdAt: {
					[Op.gte]: sevenDaysAgo,
				},
			},
		});
		let clicksArray = [];
		for (const item of dates) {
			let analysisObject = {};
			const existing_record = clicksArray.find((object) =>
				moment(object.date).isSame(item.dataValues.createdAt)
			);

			if (!existing_record) {
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
		console.log(clicksArray);
		return clicksArray;
	} catch (err) {
		console.log(err);
	}
};

const osAnalysis = async (shortId) => {
	try {
		const analysisRecords = await analytics_findAll({
			shortId: shortId,
		});
		let osArray = [];
		for (records of analysisRecords) {
			let osAnalysisObject = {};
			existing_record = osArray.find(
				(ob) => ob.osName === records.dataValues.os
			);
			if (!existing_record) {
				const osCount = await count_analysis({
					distinct: true,
					col: "os",
					where: { os: records.dataValues.os },
				});
				const userCount = await count_analysis({
					distinct: true,
					col: "os",
					where: { uid: records.dataValues.uid },
				});
				osAnalysisObject = {
					osName: records.dataValues.os,
					uniqueclicks: osCount,
					uniqueUser: userCount,
				};
				osArray.push(osAnalysisObject);
			}
		}
		console.log(osArray);
		return osArray;
	} catch (err) {
		console.log(err);
	}
};

const deviceAnalysis = async (shortId) => {
	try {
		console.log("inside device");
		const analysisRecords = await analytics_findAll({
			shortId: shortId,
		});
		let deviceArray = [];
		for (records of analysisRecords) {
			let deviceAnalysisObject = {};
			existing_record = deviceArray.find(
				(ob) => ob.deviceName === records.dataValues.deviceType
			);
			if (!existing_record) {
				const deviceCount = await count_analysis({
					distinct: true,
					col: "deviceType",
					where: { deviceType: records?.dataValues?.deviceType },
				});
				let userCount = await count_analysis({
					distinct: true,
					col: "deviceType",
					where: { uid: records?.dataValues?.uid },
				});

				deviceAnalysisObject = {
					deviceName: records.dataValues.deviceType,
					uniqueClicks: deviceCount,
					uniqueUsers: userCount,
				};

				deviceArray.push(deviceAnalysisObject);
			}
		}
		console.log(deviceArray);

		return deviceArray;
	} catch (err) {
		console.log(err);
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
