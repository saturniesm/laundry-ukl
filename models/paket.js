"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class paket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.outlet, {
        foreignKey: "id_outlet",
        as: "outlet",
      });
    }
  }
  paket.init(
    {
      id_outlet: DataTypes.INTEGER,
      jenis: DataTypes.ENUM,
      nama_paket: DataTypes.STRING,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "paket",
    }
  );
  return paket;
};
