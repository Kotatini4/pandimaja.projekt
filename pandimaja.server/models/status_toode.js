const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('status_toode', {
    status_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nimetus: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'status_toode',
    schema: 'pandimaja',
    timestamps: false,
    indexes: [
      {
        name: "status_toode_pkey",
        unique: true,
        fields: [
          { name: "status_id" },
        ]
      },
    ]
  });
};
