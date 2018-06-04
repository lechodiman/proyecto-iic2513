module.exports = (sequelize, DataTypes) => {
  const suggestedRoute = sequelize.define('suggestedRoute', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.STRING,
  });
  suggestedRoute.associate = function associate(models) {
    // associations can be defined here
    suggestedRoute.belongsTo(models.place);
  };
  return suggestedRoute;
};
