module.exports = (sequelize, DataTypes) => {
  const routeCount = sequelize.define('routeCount', {
    route_count: DataTypes.INTEGER,
  });
  routeCount.associate = function associate(models) {
    // associations can be defined here
    routeCount.belongsTo(models.route);
    routeCount.belongsTo(models.user);
  };
  return routeCount;
};
