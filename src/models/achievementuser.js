module.exports = (sequelize) => {
  const achievementUser = sequelize.define('achievementUser', {
  });
  achievementUser.associate = function associate(models) {
    // associations can be defined here
    achievementUser.belongsTo(models.user);
    achievementUser.belongsTo(models.achievement);
  };
  return achievementUser;
};
