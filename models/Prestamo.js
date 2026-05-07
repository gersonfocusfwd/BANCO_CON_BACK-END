module.exports = (sequelize, DataTypes) => {
  const Prestamo = sequelize.define('Prestamo', {
    monto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    tasa_interes: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    plazo_meses: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    monto_cuota: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'pagado'),
      defaultValue: 'pendiente'
    },
    proposito: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_aprobacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'prestamos',
    underscored: true
  });

  Prestamo.associate = (models) => {
    Prestamo.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
  };

  return Prestamo;
};
