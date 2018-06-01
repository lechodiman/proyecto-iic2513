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
      {
        name: faker.name.findName(),
        email: 'user1@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user2@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user3@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user4@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user5@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user6@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user7@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user8@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user9@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user10@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user11@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user12@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user13@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user14@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user15@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user16@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user17@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user18@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user19@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user20@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user21@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user22@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user23@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user24@example.org',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user25@example.org',
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
