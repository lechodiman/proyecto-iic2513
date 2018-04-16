module.exports = (sequelize, DataTypes) => {
    const condition = sequelize.define('condition', {
      logical_condition: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: DataTypes.STRING,
    });
    condition.associate = function associate(models) {
      // associations can be defined here
      // Adds conditionId to route, condition get the accessors getRoutes and setRoutes
      condition.belongsTo(models.achievemt);
      condition.belongsTo(models.user);
    };
    return condition;
  };
  