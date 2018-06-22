const https = require('https');
const mapConfig = require('../config/map');

async function geocode(query) {
  return new Promise(((resolve, reject) => {
    https.get(
      `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapConfig.token}`,
      async (response) => {
        let body = '';
        response.on('data', (d) => {
          body += d;
        });
        response.on('error', (e) => {
          reject(e);
        });
        response.on('end', () => {
          resolve(JSON.parse(body));
        });
      },
    );
  }));
}

module.exports = geocode;
