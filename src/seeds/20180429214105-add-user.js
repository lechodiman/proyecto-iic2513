const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

module.exports = {
  up(queryInterface) {
    const usersData = [
      {
        name: faker.name.findName(),
        email: 'user@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
