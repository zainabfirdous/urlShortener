const { shortUrl } = require("../models/url");

const findOne = async (cond) => {
	try {
		const result = await shortUrl.findOne({ where: cond });
		return result;
	} catch (err) {
		throw err;
	}
};

const create = async (record) => {
	try {
		const result = await shortUrl.create(record);
		return result;
	} catch (Err) {
		console.log(Err);
		throw Err;
	}
};

const findAll = async (cond) => {
	try {
		const result = await shortUrl.findAll({ where: cond });
		return result;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

//uses sequelize count function to create a count sql query
const url_count = async (cond) => {
	try {
		const result = await shortUrl.count(cond);
		return result;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	findOne,
	create,
	findAll,
	url_count,
};
