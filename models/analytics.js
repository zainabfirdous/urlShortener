const { UUIDV4, DataTypes } = require("sequelize");
const db = require("../config/db_config");

const sequelize = db.getInstance();

const analytics = sequelize.define(
	"analytics",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		shortId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		topic: {
			type: DataTypes.STRING,
			defaultValue: "Other",
			allowNull: true,
		},
		uid: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		os: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		deviceType: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		ipAddress: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		latitude: {
			type: DataTypes.DECIMAL(9, 6),
			allowNull: true,
		},
		longitude: {
			type: DataTypes.DECIMAL(9, 6),
			allowNull: true,
		},
	},
	{
		tableName: "analytics",
		indexes: [
			{
				unique: false,
				fields: ["shortId"],
			},
			{
				unique: false,
				fields: ["os"],
			},
			{
				unique: false,
				fields: ["deviceType"],
			},
			{
				unique: false,
				fields: ["uid"],
			},
			{
				unique: true,
				fields: ["id"],
			},
		],
	}
);

analytics.associate = (models) => {
	analytics.belongsTo(models.User, {
		foreignKey: "uid",
		as: "uid",
		onDelete: "CASCADE",
	});

	analytics.belongsTo(models.shortUrl, {
		foreignKey: "shortId",
		as: "shortId",
		onDelete: "CASCADE",
	});

	analytics.belongsTo(models.shortUrl, {
		foreignKey: "topic",
		as: "topic",
		onDelete: "CASCADE",
	});
};

module.exports = { analytics };
