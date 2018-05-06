module.exports = {
  up(queryInterface) {
    const trophyData = [
      {
        name: '5 Climbs',
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
