module.exports = (sequelize, DataTypes) => {
  const reviewPlace = sequelize.define('reviewPlace', {
    comment: DataTypes.STRING,
    allowNull: false,
  });
  reviewPlace.associate = function associate(models) {
    // associations can be defined here
    reviewPlace.belongsTo(models.user); // Adds userId attribute to reviewPlace
    reviewPlace.belongsTo(models.place); // Adds placeId attribute to reviewPlace
  };
  return reviewPlace;
};
