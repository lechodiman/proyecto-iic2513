module.exports = {
  up(queryInterface) {
    const adminsData = [
      {
        adminId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('admins', adminsData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('admins', null, {});
  },
};
