module.exports = {
  up(queryInterface) {
    const placesData = [
      {
        name: 'Cerro Manquehue',
        location: 'Santiago',
        description: 'Cerro Manquehue is the highest peak in the Santiago valley measuring in at 1638 meters above sea level! ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'La Campana National Park',
        location: 'Valparaiso',
        description: 'La Campana National Park is located in the Cordillera de la Costa, Quillota Province, in the Valparaíso Region of Chile. La Campana National Park and the Vizcachas Mountains lie northwest of Santiago..',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cerro el Roble',
        location: 'Santiago',
        description: 'Cerro El Roble is a mountain in central Chile. Much of the land area associated with this mountain was incorporated into the La Campana National Park in the late 1990s.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cerro Pochoco',
        location: 'Santiago',
        description: 'The Military Geographical Institute publishes 1804 meters above sea level. to Pochoco.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Apoquindo Waterfall',
        location: 'Santiago',
        description: 'The Apoquindo Waterfall is a waterfall in Waters of Ramon Natural Park on the east side of Santiago, Chile, near Apoquindo. It is fed by melting snow from Cerro San Ramon and Cerro Provincia.',
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
