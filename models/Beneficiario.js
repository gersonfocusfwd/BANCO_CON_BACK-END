module.exports = (sequelize, DataTypes) => {
  const Beneficiario = sequelize.define('Beneficiario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero_cuenta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    banco: {
      type: DataTypes.STRING,
      defaultValue: 'Banco CON'
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'beneficiarios',
    underscored: true
  });

  Beneficiario.associate = (models) => {
    Beneficiario.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
  };

  return Beneficiario;
};
