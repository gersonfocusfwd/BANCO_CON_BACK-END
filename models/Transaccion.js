'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaccion extends Model {
    /**
     * /////////////////////////////////////////////////////////////
     * // FUNCIONES DE ASOCIACIÓN - DEFINICIÓN DE RELACIONES
     * /////////////////////////////////////////////////////////////
     */
    static associate(models) {
      // La transacción tiene una cuenta de origen
      this.belongsTo(models.Cuenta, {
        foreignKey: 'cuenta_origen_id',
        as: 'cuenta_origen'
      });

      // La transacción tiene una cuenta de destino
      this.belongsTo(models.Cuenta, {
        foreignKey: 'cuenta_destino_id',
        as: 'cuenta_destino'
      });
    }
  }

  Transaccion.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    monto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'transferencia'
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completada', 'rechazada'),
      defaultValue: 'completada'
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    cuenta_origen_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cuenta_destino_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transaccion',
    tableName: 'transacciones',
    underscored: true,
  });

  return Transaccion;
};
