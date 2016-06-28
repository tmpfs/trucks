const cheerio = require('cheerio');
const path = require('path');

/** 
 *  Finds all import `<link>` elements in the input component files. 
 *
 *  @function imports
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Function} cb callback function.
 */
function imports(map, cb) {
  let k
    , base
    , relative
    , $
    , out = {};

  function it(index, elem) {
    const href = $(elem).attr('href');
    relative = path.normalize(path.join(base, href));
    out[k].push(relative);
  }

  for(k in map) {
    out[k] = [];
    base = path.dirname(k);
    $ = cheerio.load(map[k]);
    $('link[rel="import"][href]').each(it);
  }

  cb(null, out);
}

module.exports = imports;
