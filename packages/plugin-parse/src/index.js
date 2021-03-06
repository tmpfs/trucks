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

function read(state, types, iterator, cb) {
  state.each(types, iterator, cb);
}

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(state, mod, context, cb) {
  const readers = require('./reader')
    , selectors = state.selectors
    , components = state.components
    , Template = components.Template
    , Style = components.Style
    , Script = components.Script
    , types = [
        new readers.Template(
          mod, Template, selectors.templates, components), 
        new readers.Style(
          mod, Style, selectors.styles, components), 
        new readers.Script(
          mod, Script, selectors.scripts, components)
      ]
    , iterator = getIterator(state, mod, context);

  read(
    state,
    types,
    iterator,
    (err) => {
      if(err) {
        return cb(err);
      } 

      // found primary component template
      // so parse out partials and deeper shadow elements
      if(mod.component) {

        state.each(
          mod.templates,
          (template, next) => {

            // got some partials to assign
            if(mod.component.template !== template) {
              mod.component.partials.push(template);
            } 

            const types = [
                    new readers.Style(
                      mod, Style, selectors.styles, components),
                    new readers.Script(
                      mod, Script, selectors.scripts, components)           
                  ]
                , iterator = getIterator(state, mod, template.element);

            function it(reader, cb) {
              iterator(
                reader,
                (traits, next) => {
                  traits.forEach((trait) => {

                    // assign style scope
                    trait.scope = Style.SHADOW;

                    if(trait instanceof Style) {
                      mod.component.styles.push(trait);
                      trait.parent.stylesheets.push(trait);
                    }else{
                      // should be a script
                      mod.component.scripts.push(trait);
                      trait.parent.javascript.push(trait);
                    }
                  })
                  next();
                }, cb)
            }

            read(state, types, it, next);
          }, cb);

      }else{
        cb();
      }
    }
  );
}

/**
 *  Parse components into the compiler state `tree`.
 *
 *  This plugin should be run after the `load` plugin so that the component 
 *  import tree is available.
 *
 *  @public {function} parse
 *  @param {Object} state compiler state.
 *
 *  @returns plugin closure.
 */
function parse(/*state, conf*/) {

  return function parse(state, cb) {
    const Module = state.components.Module;

    state.each(
      state.tree.getFiles(),
      (group, next) => {
        // parse all the <dom-module> elements
        const $ = group.vdom
          , elements = $(state.selectors.modules).toArray();

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

            // add to local list of modules
            group.modules.push(mod);

            component(state, mod, context, next);
          }, next)
      },
      (err) => {

        // test for duplicate id across all templates
        try {
          duplicates(state.tree.getTemplates());
        }catch(e) {
          return cb(e); 
        }

        cb(err, state); 
      }
    );
  }
}

module.exports = parse;
