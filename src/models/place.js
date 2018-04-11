module.exports = (sequelize, DataTypes) => {
  const place = sequelize.define('place', {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
  });
  place.associate = function associate(models) {
    // associations can be defined here
  };
  return place;
};