module.exports = (sequelize, DataTypes) => {
  const place = sequelize.define('place', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.STRING,
  });
  place.associate = function associate(models) {
    // associations can be defined here

    // Adds placeId to route, place get the accessors getRoutes and setRoutes
    place.hasMany(models.route, { as: 'Routes' }, { onDelete: 'cascade', hooks: true });
    place.hasMany(models.reviewPlace, { as: 'ReviewPlaces' }, { onDelete: 'cascade', hooks: true });
    place.hasMany(models.suggestedRoute, { as: 'SuggestedRoutes' }, { onDelete: 'cascade', hooks: true });
  };
  return place;
};
