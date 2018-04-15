module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('profileComments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      SenderId:{
        type: Sequelize.STRING,
      },
      ReceiverId:{
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('profileComments');
  },
};
