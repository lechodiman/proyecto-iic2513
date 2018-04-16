module.exports = (sequelize, DataTypes) => {
  const groupMembers = sequelize.define('groupMembers', {
    groupId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,
  });
  groupMembers.associate = function associate(models) {
    // associations can be defined here
    groupMembers.belongsTo(models.user, {as: 'member'});
    groupMembers.belongsTo(models.group);
  };
  return groupMembers;
};
