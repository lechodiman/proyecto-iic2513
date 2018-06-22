module.exports = (sequelize, DataTypes) => {
  const suggestedPlace = sequelize.define('suggestedPlace', {
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
  suggestedPlace.associate = function associate() {
    // associations can be defined here
  };
  return suggestedPlace;
};
