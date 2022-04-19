"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
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
    user.init({
        nama: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.TEXT,
        id_outlet: DataTypes.INTEGER,
        role: DataTypes.ENUM,
        image: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "user",
    });
    return user;
};