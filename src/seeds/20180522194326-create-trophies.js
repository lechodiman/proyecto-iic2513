module.exports = {
  up(queryInterface) {
    const trophyData = [
      {
        name: '10 Climbs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '25 Climbs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '50 Climbs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '100 Climbs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('achievements', trophyData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('achievementssss', null, {});
  },
};

