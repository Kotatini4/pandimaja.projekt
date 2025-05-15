const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tootaja', {
    tootaja_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nimi: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    perekonnanimi: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    kood: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: "tootaja_kood_key"
    },
    tel: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    aadres: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'role',
        key: 'role_id'
      }
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tootaja',
    schema: 'pandimaja',
    timestamps: false,
    indexes: [
      {
        name: "tootaja_kood_key",
        unique: true,
        fields: [
          { name: "kood" },
        ]
      },
      {
        name: "tootaja_pkey",
        unique: true,
        fields: [
          { name: "tootaja_id" },
        ]
      },
    ]
  });
};
