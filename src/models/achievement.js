module.exports = (sequelize, DataTypes) => {
  const achievement = sequelize.define('achievement', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.STRING,
  });
  achievement.associate = function associate(models) {
    // associations can be defined here
    achievement.hasMany(models.condition, { as: 'Conditions' }, { onDelete: 'cascade', hooks: true });
  };
  return achievement;
};
