const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Tarjeta extends Model {
    static associate(models) {
      // Una tarjeta pertenece a un usuario
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
    }
  }

  Tarjeta.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_tarjeta: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    tipo: {
      type: DataTypes.ENUM('Debito', 'Credito'),
      allowNull: false
    },
    marca: {
      type: DataTypes.ENUM('Visa', 'Mastercard', 'American Express'),
      allowNull: false
    },
    cvv: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    fecha_expiracion: {
      type: DataTypes.STRING(5), // Formato MM/YY
      allowNull: false
    },
    limite: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    saldo_utilizado: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    estado: {
      type: DataTypes.ENUM('Activa', 'Bloqueada', 'Vencida'),
      defaultValue: 'Activa'
    }
  }, {
    sequelize,
    modelName: 'Tarjeta',
    tableName: 'tarjetas',
    underscored: true,
    timestamps: true
  });

  return Tarjeta;
};
