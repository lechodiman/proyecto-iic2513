module.exports = {
  up(queryInterface) {
    const placesData = [
      {
        name: 'Place 1',
        location: 'Santiago',
        description: 'The first place on the website.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('places', placesData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('places', null, {});
  },
};
