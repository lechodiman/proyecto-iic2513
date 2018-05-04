module.exports = (sequelize, DataTypes) => {
  const route = sequelize.define('route', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.STRING,
  });
  route.associate = function associate(models) {
    // associations can be defined here

    route.belongsTo(models.place); // Adds placeId attribute to route
    // Adds routeId to reviewRoute, route get the accessors getReviewRoutes and setReviewRoutes
    route.hasMany(models.reviewRoute, { as: 'ReviewRoutes' }, { onDelete: 'cascade', hooks: true });
    route.hasMany(models.routeCount, { as: 'RouteCount' }, { onDelete: 'cascade', hooks: true });
  };
  return route;
};
