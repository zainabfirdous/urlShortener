const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "Express API with Swagger",
		version: "1.0.0",
		description:
			"This application is focused on helping users create shortUrls, redirect to origin-url and view analytics of their short-urls",
	},
	servers: [
		{
			url: "http://localhost:3000",
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ["./routes/*.js"],
};

module.exports = options;
