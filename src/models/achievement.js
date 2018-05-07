module.exports = (sequelize, DataTypes) => {
  const achievement = sequelize.define('achievement', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  achievement.associate = function associate(models) {
    // associations can be defined here
    achievement.hasMany(models.achievementUser, { as: 'AchievementUsers' }, { onDelete: 'cascade', hooks: true });
  };
  return achievement;
};
