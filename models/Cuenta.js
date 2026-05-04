'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cuenta extends Model {
    /**
     * /////////////////////////////////////////////////////////////
     * // FUNCIONES DE ASOCIACIÓN - DEFINICIÓN DE RELACIONES
     * /////////////////////////////////////////////////////////////
     */
    static associate(models) {
      // Cada cuenta pertenece a un usuario
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      // Una cuenta puede ser origen de muchas transacciones
      this.hasMany(models.Transaccion, {
        foreignKey: 'cuenta_origen_id',
        as: 'transacciones_enviadas'
      });

      // Una cuenta puede ser destino de muchas transacciones
      this.hasMany(models.Transaccion, {
        foreignKey: 'cuenta_destino_id',
        as: 'transacciones_recibidas'
      });
    }
  }

  Cuenta.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_cuenta: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    tipo_cuenta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    saldo: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cuenta',
    tableName: 'cuentas',
    underscored: true,
  });

  return Cuenta;
};
