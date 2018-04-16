const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}



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
    user.hasMany(models.reviewRoute, {as: 'ReviewRoutes'}, { onDelete: 'cascade', hooks: true });
    user.hasMany(models.reviewPlace, {as: 'ReviewPlaces'}, { onDelete: 'cascade', hooks: true });
    user.hasMany(models.profileComment, {as: 'SentComment'}, { onDelete: 'cascade', hooks: true });
    user.hasMany(models.profileComment, {as: 'ReceivedComment'}, { onDelete: 'cascade', hooks: true });
    user.hasMany(models.condition, {as: 'Conditions'}, { onDelete: 'cascade', hooks: true });
  };

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
