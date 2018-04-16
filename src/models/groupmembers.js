module.exports = (sequelize, DataTypes) => {
  const groupMembers = sequelize.define('groupMembers', {
    groupId: {
      type: DataTypes.INTEGER,
      unique: 'unique',
    },
    memberId: {
      type: DataTypes.INTEGER,
      unique: 'unique',
    },
  });
  groupMembers.associate = function associate(models) {
    // associations can be defined here
    groupMembers.belongsTo(models.user, {as: 'member'});
    groupMembers.belongsTo(models.group);
  };
  return groupMembers;
};
