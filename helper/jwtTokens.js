const jwt = require("jsonwebtoken");
const { secret } = require("../constant");

const encode = async (payload) => {
	try {
		const token = jwt.sign(payload, secret, { expiresIn: "1h" });
		return token;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const decode = async (token) => {
	try {
		const verifyToken = jwt.verify(token, secret);
		return verifyToken;
	} catch (err) {
		console.log(err);
		const error = new Error("you are not authorized to perform this action");
		error.status = 401;
		throw error;
	}
};

module.exports = { encode, decode };
