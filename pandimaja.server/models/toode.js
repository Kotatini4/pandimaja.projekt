const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "toode",
        {
            toode_id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            nimetus: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            kirjaldus: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "status_toode",
                    key: "status_id",
                },
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            hind: {
                type: DataTypes.DECIMAL(19, 4),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "toode",
            schema: "pandimaja",
            timestamps: false,
            indexes: [
                {
                    name: "toode_pkey",
                    unique: true,
                    fields: [{ name: "toode_id" }],
                },
            ],
        }
    );
};
