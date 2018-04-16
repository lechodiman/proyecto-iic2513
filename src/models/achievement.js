module.exports = (sequelize, DataTypes) => {
  const achievemt = sequelize.define('achievemt', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.STRING,
  });
  achievemt.associate = function associate(models) {
    // associations can be defined here
    achievemt.hasMany(models.condition, { as: 'Conditions' }, { onDelete: 'cascade', hooks: true });
  };
  return achievemt;
};
