const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('klient', {
    klient_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nimi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    perekonnanimi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kood: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: "klient_kood_key"
    },
    tel: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    aadres: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'klient',
    schema: 'pandimaja',
    timestamps: false,
    indexes: [
      {
        name: "klient_kood_key",
        unique: true,
        fields: [
          { name: "kood" },
        ]
      },
      {
        name: "klient_pkey",
        unique: true,
        fields: [
          { name: "klient_id" },
        ]
      },
    ]
  });
};
