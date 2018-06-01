module.exports = (sequelize, DataTypes) => {
  const routeImage = sequelize.define('routeImage', {
    url: DataTypes.STRING,
  });
  routeImage.associate = function associate(models) {
    // associations can be defined here
    routeImage.belongsTo(models.route);
    routeImage.belongsTo(models.user);
  };
  return routeImage;
};