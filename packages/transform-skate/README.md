# Skate Transform

> Compiles web component templates to render functions

## Install

```
npm i trucks-transform-skate --save-dev
```

For the command line interface see [trucks-cli][].

---

- [Install](#install)
- [Usage](#usage)
- [Overview](#overview)
- [API](#api)
  - [skate](#skate)
  - [options](#options)
  - [html](#html)
  - [main](#main)
  - [map](#map)
  - [render](#render)
- [License](#license)

---

## Usage

Programmatic usage:

```javascript
const trucks = require('trucks');

trucks(
  {
    files: ['example/components.html'],
    transforms: ['skate']
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
```

For command line usage see [trucks-cli][].

## Overview

The library takes an HTML template and compiles it to a `render` function.

An HTML template such as:

```html
<template id="x-blog-post">
  <div class="post">
    <script>
      if(this.title) {
        html('<h3>${this.title}</h3>'); 
      }
    </script>
    <p>Article content</p>
  </div>
</template>
```

Will result in the compiled function:

```javascript
function render(elem) {
  skate.vdom.element("div", {
    "class": "post"
  }, () => {
    var _this = this;

    if (this.title) {
      skate.vdom.element("h3", () => {
        skate.vdom.text(`${ _this.title }`);
      });
    }

    skate.vdom.element("p", () => {
      skate.vdom.text("Article content");
    });
  });
}
```

Note that whitespace in the source template is normalized by default.

The compiler then creates a map of component identifiers to template render functions:

```javascript
const templates = {
  "x-blog-post": function render(elem) {
    skate.vdom.element("div", {
      "class": "post"
    }, () => {
      var _this = this;

      if (this.title) {
        skate.vdom.element("h3", () => {
          skate.vdom.text(`${ _this.title }`);
        });
      }

      skate.vdom.element("p", () => {
        skate.vdom.text("Article content");
      });
    });
  }
};
```

And exposes a main function that performs a lookup in the template map by element tag name:

```javascript
function template(elem) {
  return templates[elem.tagName.toLowerCase()].call(elem, elem);
}
```

Component authors may now proxy the `render` function to the `template` function, for example:

```javascript
skate.define('x-blog-post', {
  render: template
});
```

This compile phase is not required for [polymer][] components as they already use HTML templates.

## API

### skate

```javascript
public skate(state, conf)
```

Compiles HTML `<template>` elements to render functions.

* `state` Object compiler state.
* `conf` Object plugin configuration object.

### options

```javascript
options(opts)
```

Get computed compiler options.

Merges input compiler options with the default option configuration.

Returns computed processing options.

* `opts` Object processing options.

#### Options

* `attr` String=id attribute name used for the component id.
* `skate` String=skate name of the skatejs variable.
* `idom` String=vdom name of the vdom property.
* `element` String=element name of the element function.
* `text` String=text name of the text function.
* `templates` String=templates name of the templates map.
* `main` String=template name of the main function.
* `scripts` Boolean=true parse template script elements.
* `html` String=html name of the `html` function for inline scripts.
* `normalize` Boolean=true normalize whitespace in templates.
* `literals` Object|Boolean=true flags for template literal support.
* `dom` Object options to use when parsing the DOM.

### html

```javascript
html(html, opts)
```

Compile an HTML string to AST programs representing each `<template>`
element in the input HTML.

Template literal support is enabled by default. You can pass the
`literals` option as `false` to disable template literals for attributes and
text nodes or an object that configures the `text` and `attribute` flags.

The following examples are equivalent:

```javascript
html(tpl, {literals: false});
html(tpl, {literals: {text: false, attribute: false});
```

Returns a list of compiled templates.

* `html` String an HTML string.
* `opts` Object processing options.

#### Throws

* `Error` if a template element does not define an identifier.

### main

```javascript
public main(opts)
```

Build a main function that accepts an `elem` argument and performs a
lookup in the templates map to execute the template function.

Returns program representing the main function.

* `opts` Object processing options.

### map

```javascript
public map(templates, opts)
```

Converts the output of a compile pass to an object map of component
identifiers to render functions.

Returns AST program mapping components to render functions.

* `templates` Array list of compiled template programs.
* `opts` Object processing options.

### render

```javascript
public render(el, opts)
```

Convert a single DOM `<template>` element to an AST program representing
the contents for a render function body.

Returns function body AST.

* `el` Object the element DOM.
* `opts` Object processing options.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 27, 2016

[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
[skatejs]: https://github.com/skatejs/skatejs
[webcomponents]: https://github.com/w3c/webcomponents
[shadow-dom]: https://w3c.github.io/webcomponents/spec/shadow/
[custom-elements]: https://www.w3.org/TR/custom-elements/
[html-imports]: https://w3c.github.io/webcomponents/spec/imports/
[html-templates]: https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
[polymer]: https://www.polymer-project.org/1.0/
[react]: https://facebook.github.io/react/
[react-webcomponents]: https://github.com/facebook/react/issues/5052
[react-integration]: https://github.com/skatejs/react-integration
[mozilla-webcomponents]: https://hacks.mozilla.org/2014/12/mozilla-and-web-components/
[csp]: http://content-security-policy.com/
[npm]: https://www.npmjs.com/
[postcss]: https://github.com/postcss/postcss
[mkdoc]: https://github.com/mkdoc/mkdoc
[mkapi]: https://github.com/mkdoc/mkapi
[mkparse]: https://github.com/mkdoc/mkparse
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[sources]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-sources
[load]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-load
[parse]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-parse
[transform]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-transform
[generate]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-generate
[write]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-write
[transform-csp]: https://github.com/tmpfs/trucks/blob/master/packages/transform-csp
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

