module.exports = {
  up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'routeImages',
      'userId',
      Sequelize.INTEGER,
    );
  },

  down(queryInterface) {
    queryInterface.removeColumn(
      'routeImages',
      'userId',
    );
  },
};
