'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * /////////////////////////////////////////////////////////////
     * // FUNCIONES DE ASOCIACIÓN - DEFINICIÓN DE RELACIONES
     * /////////////////////////////////////////////////////////////
     */
    static associate(models) {
      // Un usuario puede tener muchas cuentas
      this.hasMany(models.Cuenta, {
        foreignKey: 'usuario_id',
        as: 'cuentas'
      });
    }
  }

  Usuario.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    underscored: true,
  });

  return Usuario;
};
