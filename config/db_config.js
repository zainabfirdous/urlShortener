require("dotenv").config();
const sequelize = require("sequelize");

//created class for having only one instance of db, following the singleton pattern
class db {
	constructor() {
		this.sequelizeInstance = null;
	}

	//this function creates an instance only if it doesn't exists already
	initialize() {
		if (!this.sequelizeInstance) {
			this.sequelizeInstance = new sequelize({
				database: process.env.DB_NAME,
				username: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				host: "127.0.0.1",
				dialect: "mysql",
				port: "3306",
				pool: {
					max: 10,
					min: 0,
					acquire: 30000,
					idle: 30000,
				},
				logging: console.log,
			});
		}
		return this.sequelizeInstance;
	}

	//class initialize() to eensure the instance exists and then checks the status of the db connection
	async testConnection() {
		const dbInstance = this.initialize();
		try {
			await dbInstance.authenticate();
			console.log("connection has been successfully established");

			await dbInstance.sync();
			console.log("table synchronization with database done");
		} catch (err) {
			console.log(`Error while establishing db connection: ${err}`);
		}
	}

	//function to get the db instance for creating models
	getInstance() {
		if (!this.sequelizeInstance) {
			this.initialize();
		}
		return this.sequelizeInstance;
	}
}

module.exports = new db();
