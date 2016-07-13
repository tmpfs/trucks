const each = require('./each')
    , selectors = require('./selectors')
    , Module = require('./component').Module
    , ID = 'id';

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(mod, state, context, cb) {
  const options = state.options;

  const $ = mod.querySelectorAll
      , readers = require('./reader')
      , types = [
          new readers.Template(mod), 
          new readers.Style(mod), 
          new readers.Script(mod)
        ];

  function iterator(reader, cb) {
    const elements = reader.getElements($, context);

    each(
      elements,
      (el, next) => {

        const trait = reader.getTrait(el);

        reader.getContents(trait, el, $, (err, contents) => {
          if(err) {
            return next(err); 
          }

          trait.contents = contents;

          reader.onTrait(state, trait, (err) => {
            if(err) {
              return next(err); 
            }
          
            // perform {{id}} replacement
            if(trait
              && trait.contents === String(trait.contents)
              && options.id
              && options.id.replace
              && (options.id.pattern instanceof RegExp)) {

              trait.contents = trait.contents.replace(
                options.id.pattern, mod.id); 
            }

            next(null, trait);
          });
        })
      },
      cb
    )
  }

  each(
    types,
    iterator,
    (err) => {
      if(err) {
        return cb(err);
      } 
      // found primary component template
      if(mod.component) {

        // got some partials to assign
        if(mod.templates.length > 1) {
          for(let i = 0;i < mod.templates.length;i++) {
            if(mod.component.template !== mod.templates[i]) {
              mod.component.partials.push(mod.templates[i]); 
            } 
          }
          console.log('got module with partials...'); 
        }
      }

      cb();
    }
  );
}

/**
 *  Iterate `<dom-module>` elements.
 *
 *  @private {function} modules
 */
function modules(state, cb) {
  each(
    state.result.files,
    (group, next) => {
      // parse all the <dom-module> elements
      const $ = group.querySelectorAll
        , elements = $(selectors.modules).toArray();

      // no component imports and no modules declared
      //if(!elements.length
        //&& !group.imports.length
        //&& !group.duplicates.length) {
        //return cb(new Error(
          //`no imports or component modules in ${group.file}`)); 
      //}

      each(
        elements,
        (context, next) => {
          const id = $(context).attr(ID);

          if(!id) {
            return next(
              new Error(
                `identifier missing for component module in ${group.file}`)); 
          }

          const mod = new Module(id, group);

          // validate custom element name as per the spec
          try {
            mod.validate(id);
          }catch(e) {
            return next(e); 
          }

          // proxy document query function
          mod.querySelectorAll = $;

          // add to local list of modules
          group.modules.push(mod);

          // add to global list of all modules
          state.result.modules.push(mod);

          component(mod, state, context, next);
        }, next)
    },
    (err) => {
      cb(err, state); 
    }
  );
}

module.exports = modules;
