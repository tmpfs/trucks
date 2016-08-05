/**
 *  Creates the entire compiler state `tree` by delegating to the load and 
 *  parse plugins.
 *
 *  @public {function} sources
 *
 *  @returns list of delegated plugins.
 */
function sources() {
  return [
    require('trucks-plugin-load'),
    require('trucks-plugin-parse')
  ]; 
}

module.exports = sources;
