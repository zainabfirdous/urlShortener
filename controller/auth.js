const { loginUser, registerUser } = require("../service/auth");

const signInUser = async (req) => {
	try {
		const response = await loginUser(req);
		return response;
	} catch (err) {
		throw err;
	}
};

const signUpUser = async (req) => {
	try {
		const response = await registerUser(req);
		return response;
	} catch (err) {
		throw err;
	}
};

module.exports = { signInUser, signUpUser };
