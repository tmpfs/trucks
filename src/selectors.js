/**
 *  @private
 *
 *  Selectors used internally for processing HTML files.
 *
 *  It is strongly recommended you do not modify these values they are 
 *  declared here to prevent needing an additional module which would 
 *  invoke require().
 *
 *  These options are not documented in the API docs as they are not 
 *  intended to be modified.
 */
module.exports = {
  modules: 'dom-module',
  imports: 'link[rel="import"][href]',
  styles: '> style, > link[rel="stylesheet"][href]',
  scripts: '> script',
  templates: '> template, > link[rel="template"][href]'
}
