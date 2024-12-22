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

module.exports = {
	findOne,
	create,
};
