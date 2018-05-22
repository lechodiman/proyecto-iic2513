module.exports = {
  up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'users',
      'picture',
      Sequelize.STRING,
    );
  },

  down(queryInterface) {
    queryInterface.removeColumn(
      'users',
      'picture',
    );
  },
};
