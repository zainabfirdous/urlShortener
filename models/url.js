const { UUIDV4, DataTypes } = require("sequelize");
const db = require("../config/db_config");

const sequelize = db.getInstance();

const shortUrl = sequelize.define(
	"short_url",
	{
		shortId: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		uid: {
			type: DataTypes.UUID,
			references: {
				model: "user",
				key: "uid",
			},
			allowNull: true,
		},
		originalUrl: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate: {
				isUrl: true,
			},
		},
		alias: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		topic: {
			type: DataTypes.STRING,
			defaultValue: "Other",
			allowNull: true,
		},
	},
	{
		tableName: "short_url",
		indexes: [
			{
				unique: false,
				fields: ["uid"],
			},
			{
				unique: true,
				fields: ["alias"],
			},
			{
				unique: true,
				fields: ["originalUrl"],
			},
			{
				unique: false,
				fields: ["topic"],
			},
		],
	}
);

shortUrl.associate = (models) => {
	shortUrl.belongsTo(models.User, {
		foreignKey: "uid",
		as: "uid",
		onDelete: "CASCADE",
	});

	shortUrl.hasMany(models.analytics, {
		foreignKey: "shortId",
		as: "shortId",
		onDelete: "CASCADE",
	});

	shortUrl.hasMany(models.analytics, {
		foreignKey: "topic",
		as: "topic",
		onDelete: "CASCADE",
	});

	shortUrl.hasMany(models.analytics, {
		foreignKey: "uid",
		as: "createdBy",
		onDelete: "CASCADE",
	});
};

module.exports = { shortUrl };
