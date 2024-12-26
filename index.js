const express = require("express");
const cors = require("cors");
const { shorten } = require("./routes/shorten");
const { analyser } = require("./routes/analyser");
const { authGoogle } = require("./routes/authGoogle");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const options = require("./routes/swagger_config");

const database = require("./config/db_config");

const app = express();

app.use(
	cors({
		origin: "*",
		methods: "GET, POST, PUT, DELETE",
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJsdoc(options);
console.log(JSON.stringify(swaggerSpec, null, 2));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//setting routes based on api prefix
app.use("/auth", authGoogle);
app.use("/api/shorten", shorten);
app.use("/api/analytics", analyser);

app.use((err, req, res, next) => {
	console.error("Error:", err.message);
	const statusCode = err.status || 500; // Default to 500 if status is not set
	res.status(statusCode).json({ error: err.message });
});

//function to ensure the db connection is established before starting the server
const startServer = async () => {
	await database.testConnection();
	const port = 3000;
	app.listen(port, (err) => {
		if (err) {
			console.log(`Error starting server: ${err}`);
		}
		console.log(`server is running on http://localhost:${port}`);
	});
};

startServer();
