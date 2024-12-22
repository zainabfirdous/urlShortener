const JOI = require("joi");

const createForm = JOI.object({
	longUrl: JOI.string().uri().required(),
	customAlias: JOI.string().optional(),
	topic: JOI.string().optional(),
});

const redirectForm = JOI.object({
	alias: JOI.string().required(),
});

class Validator {
	constructor() {}

	async isValidCreateForm(body = {}) {
		return await createForm.validateAsync(body);
	}

	async isValidRedirectForm(alias = "") {
		console.log(alias);
		return await redirectForm.validateAsync(alias);
	}
}

module.exports = new Validator();
