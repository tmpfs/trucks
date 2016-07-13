const path = require('path')
    , fs = require('fs')
    , each = require('./each')
    , selectors = require('./selectors')
    , Module = require('./component').Module
    , Template = require('./component').Template
    , Style = require('./component').Style
    , Script = require('./component').Script
    , Component = require('./component').Component
    , STYLE = 'style'
    , TEMPLATE = 'template'
    , ID = 'id';

function readContents(trait, href, cb) {
  const file = trait.parent.parent.file
      , base = path.dirname(file)
      , pth = path.normalize(path.join(base, href));

  trait.href = href;

  fs.readFile(pth, (err, contents) => {
    if(err) {
      return cb(err); 
    } 
    cb(null,
      contents.toString(),
      {file: file, base: base, path: path});
  })
}

/**
 *  Compile all inline `<template>` elements an array of HTML strings.
 *
 *  @private
 */
function templates(mod, state, el, cb) {
  const file = mod.parent.file
      , base = path.dirname(file)
      , $ = mod.querySelectorAll;

  let trait;

  function done(item) {

    item.querySelectorAll = state.parser.parse(item.contents);
    el = item.querySelectorAll(el);

    const prefix = /-$/.test(mod.id) ? mod.id : mod.id + '-'
      , id = el.attr(ID);

    // inherit template from module
    if(!id || id === mod.id) {

      if(mod.component) {
        return cb(new Error(
          `duplicate main template for ${mod.id} in ${mod.file}`)); 
      }

      // set id attribute in case it were undefined
      // thereby inherit from the module id
      el.attr(ID, mod.id);

      // assign as primary component template
      mod.component = new Component(item, mod);

    // prefix module id to template with existing
    // identifier and treat as a partial template
    }else if(id && id !== mod.id) {
      el.attr(ID, prefix + id); 
    }

    // assign id to trait
    item.id = el.attr(ID);

    // update trait contents and query
    // as we have written the dom with id attributes
    item.contents = $.html(el);
    item.querySelectorAll = state.parser.parse(item.contents);

    item.trim(state.options.trim); 

    mod.templates.push(item);
    state.result.templates.push(item);
    cb(null, item);
  }

  // inline template element
  if(el.name === TEMPLATE) {
    trait = new Template(el, $.html(el), mod);
    done(trait);
  // external template reference
  }else{
    const href = $(el).attr('href')
      , pth = path.normalize(path.join(base, href));
    fs.readFile(pth, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      trait = new Template(el, contents.toString(), mod, href, pth);
      done(trait);
    })
  }
}

/**
 *  Compile all inline and external stylesheets to an array of CSS strings.
 *
 *  @private
 */
function styles(mod, state, el, cb) {
  const file = mod.parent.file
    , base = path.dirname(file)
    , $ = mod.querySelectorAll;

  let trait;

  function done(item) {
    item.querySelectorAll = state.parser.parse(item.contents);
    item.trim(state.options.trim); 
    mod.styles.push(item);
    state.result.styles.push(item);
    cb(null, item);
  }

  // inline style element
  if(el.name === STYLE) {
    trait = new Style(el, $(el).text(), mod);
    done(trait);
  // external stylesheet reference
  }else{
    const href = $(el).attr('href')
      , pth = path.normalize(path.join(base, href));

    fs.readFile(pth, (err, contents) => {
      if(err) {
        return cb(err); 
      } 

      trait = new Style(
        el, contents.toString(), mod, href, file);
      done(trait);
    })
  }
}

/**
 *  Compile all inline and external scripts to an array of Javascript strings.
 *
 *  @private
 */
function scripts(mod, state, el, cb) {
  const file = mod.parent.file
      , base = path.dirname(file)
      , $ = mod.querySelectorAll
      , src = $(el).attr('src');

  let trait;

  function done(item) {
    item.querySelectorAll = state.parser.parse(item.contents);

    item.trim(state.options.trim); 

    mod.scripts.push(item);
    state.result.scripts.push(item);
    cb(null, item);
  }

  // inline script element
  if(!src) {
    trait = new Script(el, $(el).text(), mod);
    done(trait);
  // external script reference
  }else{
    const href = $(el).attr('src')
      , pth = path.normalize(path.join(base, href));
    fs.readFile(pth, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      trait = new Script(
        el, contents.toString(), mod, href, file);
      done(trait);
    })
  }
}

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(mod, state, context, cb) {
  //const options = state.options;

  const $ = mod.querySelectorAll
    , types = [
        {
          handler: templates,
          elements: $(selectors.templates, context).toArray(),
          getTrait: (el, mod, contents, href, file) => {
            return new Template(el, contents, mod, href, file);
          },
          isInline: (el) => {
            return el.name === TEMPLATE     
          },
          getInlineContents: (el, $) => {
            return $.html(el);
          },
          getExternalHref: (el, $) => {
            return $(el).attr('href') 
          },
          onTrait: (item, cb) => {

            item.querySelectorAll = state.parser.parse(item.contents);
            const el = item.querySelectorAll(item.element);

            const prefix = /-$/.test(mod.id) ? mod.id : mod.id + '-'
              , id = el.attr(ID);

            // inherit template from module
            if(!id || id === mod.id) {

              if(mod.component) {
                return cb(new Error(
                  `duplicate main template for ${mod.id} in ${mod.file}`)); 
              }

              // set id attribute in case it were undefined
              // thereby inherit from the module id
              el.attr(ID, mod.id);

              // assign as primary component template
              mod.component = new Component(item, mod);

            // prefix module id to template with existing
            // identifier and treat as a partial template
            }else if(id && id !== mod.id) {
              el.attr(ID, prefix + id); 
            }

            // assign id to trait
            item.id = el.attr(ID);

            // update trait contents and query
            // as we have written the dom with id attributes
            item.contents = $.html(el);
            item.querySelectorAll = state.parser.parse(item.contents);

            item.trim(state.options.trim); 

            mod.templates.push(item);
            state.result.templates.push(item);
            cb(null, item);
          }
        },
        {
          handler: styles,
          elements: $(selectors.styles, context).toArray(),
          getTrait: (el, mod, contents, href, file) => {
            return new Style(el, contents, mod, href, file);
          },
          isInline: (el) => {
            return el.name === STYLE
          },
          getInlineContents: (el, $) => {
            return $(el).text();
          },
          getExternalHref: (el, $) => {
            return $(el).attr('href') 
          },
          onTrait: (item, cb) => {
            item.querySelectorAll = state.parser.parse(item.contents);
            item.trim(state.options.trim); 
            mod.styles.push(item);
            state.result.styles.push(item);
            cb(null, item);
          }
        },
        {
          handler: scripts,
          elements: $(selectors.scripts, context).toArray(),
          getTrait: (el, mod, contents, href, file) => {
            return new Script(el, contents, mod, href, file);
          },
          isInline: (el, $) => {
            const src = $(el).attr('src');
            return src === undefined;
          },
          getInlineContents: (el, $) => {
            return $(el).text();
          },
          getExternalHref: (el, $) => {
            return $(el).attr('src') 
          },
          onTrait: (item, cb) => {
            item.querySelectorAll = state.parser.parse(item.contents);
            item.trim(state.options.trim); 
            mod.scripts.push(item);
            state.result.scripts.push(item);
            cb(null, item);
          }
        }
      ];

  function iterator(type, cb) {
    const elements = type.elements
        , it = type.handler
        , $ = mod.querySelectorAll;

    each(
      elements,
      (el, next) => {

        function getContents(trait, cb) {
          if(type.isInline(el, $)) {
            return cb(null, type.getInlineContents(el, $)); 
          }else{
            readContents(
              trait,
              type.getExternalHref(el, $),
              (err, contents, result) => {
                if(err) {
                  return cb(err); 
                }
                // file path info for non-inline traits
                trait.paths = result;

                cb(null, contents, result);
              }
            );
          }
        }

        const trait = type.getTrait(
          el, mod, type.isInline(el, $) ? type.getInlineContents(el, $) : '');

        getContents(trait, (err, contents) => {
          if(err) {
            return next(err); 
          }

          trait.contents = contents;
          //console.log('got trait contents %s', contents); 

          type.onTrait(trait, next);

          //next();
        })

        //if(!type.isInline(el, $)) {
          //trait.contents = type.getInlineContents(el, $);
        //}

        ////const trait = type.getTrait(
          ////el, mod, type.getInlineContents(el, $),
          ////type.getExternalHref(el, $), mod.parent.file);

        //console.log(trait);

        //next();

        //it(mod, state, el, (err, item) => {
          //if(err) {
            //return next(err); 
          //}
       
          //// perform {{id}} replacement
          //if(item
            //&& item.contents === String(item.contents)
            //&& options.id
            //&& options.id.replace
            //&& (options.id.pattern instanceof RegExp)) {

            //item.contents = item.contents.replace(
              //options.id.pattern, mod.id); 
          //}

          //next();
        //});
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
