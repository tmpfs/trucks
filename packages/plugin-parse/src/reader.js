const ID = 'id'
    , HREF = 'href'
    , SRC = 'src';

class TraitReader {
  constructor(module, type, selector, components) {
    this.parent = module; 

    // file owner
    this.owner = module.parent;

    // file resolver
    this.resolver = this.owner.resolver;

    // type of trait to instantiate
    this.Type = type;

    // selector for the component module
    this.selector = selector;

    // reference to the components classes
    this.components = components;
  }

  get vdom() {
    return this.parent.vdom;
  }

  getTrait(el) {
    return new this.Type(el, null, this.parent);
  }

  getInlineContents(el) {
    return this.vdom(el).text();
  }

  isInline(el) {
    return this.vdom(el).attr(HREF) === undefined
      && this.vdom(el).attr(SRC) === undefined;
  }

  getExternalHref(el) {
    return this.vdom(el).attr(HREF) 
  }

  getElements(context, selector) {
    return this.vdom(selector || this.selector, context).toArray()
  }

  getContents(state, trait, el, cb) {

    function done(contents, result) {
      trait.contents = contents;
      cb(null, [trait], contents, result);
    }

    if(this.isInline(el)) {
      return done(this.getInlineContents(el)); 
    }else{

      const href = this.getExternalHref(el)
          , resolver = state.getResolver(href, this.resolver);

      resolver.file = resolver.getCanonicalPath();

      resolver.getFileContents((err, contents) => {
        if(err) {
          return cb(err); 
        }

        trait.href = href;
        trait.file = resolver.file;

        done(contents.toString(), {file: resolver.file, href: href});
      })

    }
  }
}

class TemplateReader extends TraitReader {
  constructor() {
    super(...arguments);
  }

  getInlineContents(el) {
    return this.vdom.html(el);
  }

  onTrait(state, trait, cb) {
    trait.parent.templates.push(trait);
    cb(null, trait);
  }

  getContents(state, trait, el, cb) {
    super.getContents(state, trait, el, (err, traits, contents, result) => {
      if(err) {
        return cb(err); 
      } 

      // separate all template elements into individual template traits
      let templates = [];

      if(trait.href) {
        trait.vdom(trait.element).replaceWith(contents);
      }

      const external = trait.href !== undefined
          , mod = trait.parent
          , query = 'dom-module[id="' + mod.id + '"] > template'
          , elements =
              external ? mod.vdom(query).toArray()
                : traits.map((trait) => { return trait.element })
          , $ = mod.vdom;

      state.each(
        elements,
        (elem, next) => {
          let tpl = this.getTrait(elem);
          tpl.href = trait.href;
          tpl.file = trait.file;

          const el = $(elem); 
          const prefix = /-$/.test(mod.id) ? mod.id : mod.id + '-'
            , id = el.attr(ID);

          // inherit template from module
          if(!id || id === mod.id) {

            if(mod.component) {
              return next(new Error(
                `duplicate main template for ${mod.id} in ${mod.file}`)); 
            }

            // set id attribute in case it were undefined
            // thereby inherit from the module id
            el.attr(ID, mod.id);

            // assign as primary component template
            mod.component = new this.components.Component(tpl, mod);
          }else{
            // prefix module id to template with existing
            // identifier and treat as a partial template
            el.attr(ID, prefix + id); 
          }

          // assign id to trait
          tpl.id = el.attr(ID);

          // update trait contents and query
          // as we have written the dom with id attributes
          tpl.contents = $.html(elem);

          templates.push(tpl);

          next();
        },
        (err) => {
        if(err) {
          return cb(err); 
        }
        cb(null, templates, contents, result);
      })

    })
  }
}

class StyleReader extends TraitReader {
  constructor() {
    super(...arguments);
  }

  onTrait(state, trait, cb) {

    // global scope styles
    trait.parent.styles.push(trait);

    // all styles
    trait.parent.stylesheets.push(trait);

    cb(null, this);
  }

}

class ScriptReader extends TraitReader {
  constructor() {
    super(...arguments);
  }

  getExternalHref(el) {
    return this.vdom(el).attr(SRC);
  }

  onTrait(state, trait, cb) {
    trait.parent.scripts.push(trait);

    // all javascript
    trait.parent.javascript.push(trait);

    cb(null, trait);
  }
}

module.exports = {
  Template: TemplateReader,
  Style: StyleReader,
  Script: ScriptReader
}
