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
  };
  return route;
};
