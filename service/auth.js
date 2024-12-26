const { accExists, createAccount } = require("../crud/user");
const { encode } = require("../helper/jwtTokens");

const loginUser = async (req) => {
	try {
		const { sub, email } = req.userDetails;

		//checking if the user is registred
		const userExists = await accExists({ social_id: sub });
		if (userExists) {
			//generating jwt token for further requests
			const authToken = await encode({
				social_id: sub,
				email: email,
				uid: userExists.dataValues.uid,
			});
			const res_object = {
				accessToken: authToken,
				message:
					"Login successsful, create short-url or explore your url-analytics",
			};
			return res_object;
		} else {
			//if user account is not registered throwing 404 error
			const error = new Error(
				"user doesn't exists. Please create an account to create shortUrls"
			);
			error.status = 404;
			throw error;
		}
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const registerUser = async (req) => {
	try {
		const { sub, name, email } = req.userDetails;
		//registering user
		const createUser = await createAccount({
			social_id: sub,
			name: name,
			email: email,
		});

		if (createUser) {
			//generating jwt token only if account is created successfully
			const authToken = await encode({
				social_id: sub,
				email: email,
				uid: createUser.dataValues.uid,
			});
			const res_object = {
				accessToken: authToken,
				message:
					"Account created successsfully, start creating your first short-url",
			};

			return res_object;
		}
	} catch (err) {
		console.log(err);
		//if account already exists throwing 409 error
		if (err.parent.code === "ER_DUP_ENTRY") {
			const error = new Error(
				"account already exists. Please login to create url and view analytics"
			);
			error.status = 409;
			throw error;
		}
		throw err;
	}
};

module.exports = { loginUser, registerUser };
