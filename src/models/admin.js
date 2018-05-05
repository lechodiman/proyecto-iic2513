module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define('admin', {
    adminId: DataTypes.INTEGER,
  });
  admin.associate = function associate(models) {
    // associations can be defined here
  };
  return admin;
};
