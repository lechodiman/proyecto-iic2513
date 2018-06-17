module.exports = (sequelize, DataTypes) => {
  const groupComment = sequelize.define('groupComment', {
    comment: DataTypes.STRING,
  });
  groupComment.associate = function associate(models) {
    // associations can be defined here
    groupComment.belongsTo(models.user); // Adds userId attribute to groupComment
    groupComment.belongsTo(models.group); // Adds groupId attribute to groupComment
  };
  return groupComment;
};
