const { analytics } = require("../models/analytics");

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
		return Err;
	}
};

const analytics_findAll = async (cond) => {
	try {
		const result = await analytics.findAll({ where: cond });
		return result;
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	analytics_findOne,
	analytics_create,
	analytics_findAll,
};
