module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueName',
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueEmail',
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6],
      },
    },
  });
  user.associate = function associate(models) {
    // Adds userId to reviewRoute, user get the accessors getReviewRoutes and setReviewRoutes
    user.hasMany(models.reviewRoute, {as: 'ReviewRoutes'});
    user.hasMany(models.reviewPlace, {as: 'ReviewPlaces'});
    user.hasMany(models.profileComment, {as: 'SentComment'});
    user.hasMany(models.profileComment, {as: 'ReceivedComment'});
  };
  return user;
};
