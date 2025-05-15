const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('leping', {
    leping_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    klient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'klient',
        key: 'klient_id'
      }
    },
    toode_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'toode',
        key: 'toode_id'
      }
    },
    tootaja_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tootaja',
        key: 'tootaja_id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_valja_ostud: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    pant_hind: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    valja_ostud_hind: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ostuhind: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    'müügihind': {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    leping_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'leping',
    schema: 'pandimaja',
    timestamps: false,
    indexes: [
      {
        name: "lepping_pkey",
        unique: true,
        fields: [
          { name: "leping_id" },
        ]
      },
    ]
  });
};
