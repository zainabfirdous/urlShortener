const { User } = require("../models/user");

const accExists = async (cond) => {
	try {
		const result = await User.findOne({ where: cond });

		return result;
	} catch (err) {
		throw err;
	}
};

const createAccount = async (payload) => {
	try {
		const result = await User.create(payload);
		return result;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	accExists,
	createAccount,
};
