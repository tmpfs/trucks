const ID = 'id';

/**
 *  Test for duplicate template identifiers.
 *
 *  @private {function} duplicates
 *  @param {Array} templates list of loaded templates.
 *
 *  @throws Error if a duplicate template identifier is found.
 */
function duplicates(templates) {
  const identifiers = [];
  let i
    , tpl
    , id;

  for(i = 0;i < templates.length;i++) {
    tpl = templates[i];
    id = tpl.id;
    if(~identifiers.indexOf(id)) {
      throw new Error(
        `duplicate template identifier ${id} in ${tpl.parent.file}`); 
    }
    identifiers.push(id);
  }
}

function getIterator(state, mod, context) {
  return function iterator(reader, it, cb) {
    if(!cb) {
      cb = it; 
      it = null;
    }
    const elements = reader.getElements(context);

    state.each(
      elements,
      (el, next) => {

        const trait = reader.getTrait(el);

        reader.getContents(state, trait, el, (err, traits) => {
          if(err) {
            return next(err); 
          }

          if(it) {
            return it(traits, next); 
          }

          state.each(
            traits,
            (trait, next) => {
              reader.onTrait(state, trait, next);
            },
            next
          );

        })
      },
      cb
    )
  }
}

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(state, mod, context, cb) {
    const readers = state.readers
      , types = [
          new readers.Template(mod), 
          new readers.Style(mod), 
          new readers.Script(mod)
        ]
      , iterator = getIterator(state, mod, context);

  state.each(
    types,
    iterator,
    (err) => {
      if(err) {
        return cb(err);
      } 

      // found primary component template
      if(mod.component) {

        state.each(
          mod.templates,
          (template, next) => {

            // got some partials to assign
            if(mod.component.template !== template) {
              mod.component.partials.push(template);
            } 

            // read in style traits defined in the <template> context
            // these are component styles that should be applied to the 
            // shadow DOM
            const reader = new readers.Style(mod)
              , iterator = getIterator(state, mod, template.element)

            iterator(
              reader,
              (traits, next) => {
                traits.forEach((trait) => {
                  trait.querySelectorAll = state.parser.parse(trait.contents);
                  mod.component.styles.push(trait);
                  trait.parent.stylesheets.push(trait);
                  state.result.styles.push(trait);
                })
                next();
              }, next)
          }, cb);

      }else{
        cb();
      }
    }
  );
}

function plugin(/*conf, state*/) {

  return function parse(state, cb) {
    const Module = state.components.Module;

    state.each(
      state.result.files,
      (group, next) => {
        // parse all the <dom-module> elements
        const $ = group.querySelectorAll
          , elements = $(state.selectors.modules).toArray();

        // no component imports and no modules declared
        //if(!elements.length
          //&& !group.imports.length
          //&& !group.duplicates.length) {
          //return cb(new Error(
            //`no imports or component modules in ${group.file}`)); 
        //}

        state.each(
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

            component(state, mod, context, next);
          }, next)
      },
      (err) => {

        // test for duplicate id across all templates
        try {
          duplicates(state.result.templates);
        }catch(e) {
          return cb(e); 
        }

        cb(err, state); 
      }
    );
  }
}

module.exports = plugin;
