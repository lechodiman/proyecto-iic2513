require('isomorphic-fetch');
const { Dropbox } = require('dropbox');
const storageConfig = require('../config/storage');
const fs = require('fs');

function parseUrl(url) {
  return url.replace('?dl=0', '?raw=1');
}

async function uploadFile(ctx, name, file) {
  const url = `/Tochova/${name}`;
  const dbx = new Dropbox({ accessToken: storageConfig.token });

  return new Promise(((resolve, reject) => {
    fs.readFile(file.path, async (error, contents) => {
      await dbx.filesUpload({ path: url, contents, mode: 'overwrite' })
        .then(response => dbx.sharingCreateSharedLink({
          path: response.path_display,
          short_url: false,
        }))
        .then((response) => {
          ctx.state.url = parseUrl(response.url);
          resolve();
        })
        .catch(() => {
          ctx.state.url = undefined;
          reject();
        });
    });
  }));
}


module.exports = uploadFile;
