module.exports = {
  up(queryInterface) {
    const routesData = [
      {
        name: 'Route 1',
        description: 'The first route on the website.',
        placeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('routes', routesData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('routes', null, {});
  },
};
