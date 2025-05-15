var DataTypes = require("sequelize").DataTypes;
var _klient = require("./klient");
var _leping = require("./leping");
var _role = require("./role");
var _status_toode = require("./status_toode");
var _toode = require("./toode");
var _tootaja = require("./tootaja");

function initModels(sequelize) {
  var klient = _klient(sequelize, DataTypes);
  var leping = _leping(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var status_toode = _status_toode(sequelize, DataTypes);
  var toode = _toode(sequelize, DataTypes);
  var tootaja = _tootaja(sequelize, DataTypes);

  leping.belongsTo(klient, { as: "klient", foreignKey: "klient_id"});
  klient.hasMany(leping, { as: "lepings", foreignKey: "klient_id"});
  tootaja.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(tootaja, { as: "tootajas", foreignKey: "role_id"});
  toode.belongsTo(status_toode, { as: "status", foreignKey: "status_id"});
  status_toode.hasMany(toode, { as: "toodes", foreignKey: "status_id"});
  leping.belongsTo(toode, { as: "toode", foreignKey: "toode_id"});
  toode.hasMany(leping, { as: "lepings", foreignKey: "toode_id"});
  leping.belongsTo(tootaja, { as: "tootaja", foreignKey: "tootaja_id"});
  tootaja.hasMany(leping, { as: "lepings", foreignKey: "tootaja_id"});

  return {
    klient,
    leping,
    role,
    status_toode,
    toode,
    tootaja,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
