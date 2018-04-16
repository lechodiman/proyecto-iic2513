module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });
  group.associate = function associate(models) {
    // associations can be defined here
    // Adds groupId to groupMember, group get the accessors getGroupMembers and setGroupMembers
    group.hasMany(models.groupMembers, {as: 'GroupMembers'}, { onDelete: 'cascade', hooks: true });
  };
  return group;
};
