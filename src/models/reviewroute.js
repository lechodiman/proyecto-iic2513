module.exports = (sequelize, DataTypes) => {
  const reviewRoute = sequelize.define('reviewRoute', {
    comment: DataTypes.STRING,
    allowNull: false,
  });
  reviewRoute.associate = function associate(models) {
    // associations can be defined here
    reviewRoute.belongsTo(models.user); // Adds userId attribute to reviewRoute
    reviewRoute.belongsTo(models.route); // Adds routeId attribute to reviewRoute
  };
  return reviewRoute;
};
