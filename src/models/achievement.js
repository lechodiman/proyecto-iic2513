module.exports = (sequelize, DataTypes) => {
  const achievement = sequelize.define('achievement', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  achievement.associate = function associate(models) {
    // associations can be defined here
    
  };
  return achievement;
};
