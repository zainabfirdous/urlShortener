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
		createdBy: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		uid: {
			type: DataTypes.UUID,
			defaultValue: "Other",
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
		clickedAt: {
			type: DataTypes.DATEONLY,
			allowNull: false,
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
				fields: ["createdBy"],
			},
			{
				unique: true,
				fields: ["id"],
			},
		],
	}
);

analytics.associate = (models) => {
	analytics.belongsTo(models.shortUrl, {
		foreignKey: "shortId",
		as: "shortId",
		onDelete: "CASCADE",
	});

	analytics.belongsTo(models.shortUrl, {
		foreignKey: "uid",
		as: "createdBy",
		onDelete: "CASCADE",
	});

	analytics.belongsTo(models.shortUrl, {
		foreignKey: "topic",
		as: "topic",
		onDelete: "CASCADE",
	});
};

module.exports = { analytics };
