module.exports = (sequelize, DataTypes) => {
  const achievementUser = sequelize.define('achievementUser', {
    name: DataTypes.STRING,
  });
  achievementUser.associate = function associate(models) {
    // associations can be defined here
    achievementUser.belongsTo(models.user);
    achievementUser.belongsTo(models.achievement);
  };
  return achievementUser;
};
