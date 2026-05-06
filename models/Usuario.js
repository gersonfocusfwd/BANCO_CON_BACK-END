'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

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
    },
    rol: {
      type: DataTypes.ENUM('admin', 'cliente'),
      defaultValue: 'cliente',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    underscored: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          // 🟢 encriptarContraseña
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          // 🟢 encriptarContraseña
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  // 🟢 validarPassword
  Usuario.prototype.validarPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return Usuario;
};
