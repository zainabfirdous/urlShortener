const { UUIDV4, DataTypes } = require("sequelize");
const db = require("../config/db_config");

const sequelize = db.getInstance();

const User = sequelize.define(
	"user",
	{
		uid: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		social_id: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
	},
	{
		tableName: "user",
		indexes: [
			{
				unique: true,
				fields: ["uid"],
			},
			{
				unique: true,
				fields: ["email"],
			},
		],
	}
);

User.associate = (models) => {
	User.hasMany(models.shortUrl, {
		foreignKey: "uid",
		as: "uid",
		onDelete: "CASCADE",
	});
};

module.exports = { User };
