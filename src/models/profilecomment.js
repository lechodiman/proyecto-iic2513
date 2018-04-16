module.exports = (sequelize, DataTypes) => {
  const profileComment = sequelize.define('profileComment', {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  profileComment.associate = function associate(models) {
    // associations can be defined here
    profileComment.belongsTo(models.user, {
      as: 'Sender'
    });
    profileComment.belongsTo(models.user, {
      as: 'Receiver'
    });
  };
  return profileComment;
};
