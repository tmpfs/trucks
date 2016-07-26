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
  - [html](#html)
  - [main](#main)
  - [map](#map)
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
    <h3>${this.title}</h3>
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
    skate.vdom.element("h3", () => {
      skate.vdom.text(`${ this.title }`);
    });
    skate.vdom.element("p", () => {
      skate.vdom.text(`Article content`);
    });
  });
}
```

Note that whitespace in the source template is normalized by default and that support for template literals needs to be enabled when compiling.

The compiler then creates a map of component identifiers to template render functions:

```javascript
const templates = {
  "x-blog-post": function render(elem) {
    skate.vdom.element("div", {
      "class": "post"
    }, () => {
      skate.vdom.element("h3", () => {
        skate.vdom.text(`${ this.title }`);
      });
      skate.vdom.element("p", () => {
        skate.vdom.text(`Article content`);
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

### html

```javascript
html(html, opts)
```

```javascript
const trucks = require('trucks')
  , tpl = '<template id="x-component"></template>'
  , {map, main, list} = trucks.compile(tpl);
```

Compile an HTML string to babel AST programs representing each `<template>`
element in the input HTML.

The return object contains a `map` object which is an AST program
representing a map of component identifiers (extracted from the template
`id` attribute by default) to render functions.

To generate the string code for the template map:

```javascript
const trucks = require('trucks')
  , babel = require('babel-core')
  , tpl = '<template id="x-component"></template>'
  , info = trucks.compile(tpl)
  , {code} = babel.transformFromAst(info.map);
console.log(code);
```

The main function is exposed on the return object as a `main` property, it
is an AST program.

The return object also contains a `list` array with information about each
compiled `<template>` element including the compiled function `body` and
a `render` function as an AST program. Typically there is no need for
consumers to use this property as the `map` and `main` fields are enough
to generate the compiled code.

Template literal support is not enabled by default. You can pass the
`literals` option as `true` to enable template literals for attributes and
text nodes or an object that configures the `text` and `attribute` flags.

The following examples are equivalent:

```javascript
trucks.compile(tpl, {literals: true});
trucks.compile(tpl, {literals: {text: true, attribute: true});
```

Returns a list of compiled templates.

* `html` String an HTML string.
* `opts` Object processing options.

#### Options

* `attr` String=id attribute name used for the component id.
* `skate` String=skate name of the skatejs variable.
* `vdom` String=vdom name of the vdom property.
* `element` String=element name of the element function.
* `text` String=text name of the text function.
* `templates` String=templates name of the templates map.
* `main` String=template name of the main function.
* `normalize` Boolean=true normalize whitespace in templates.
* `literals` Object|Boolean flags for template literal support.
* `dom` Object options to use when parsing the DOM.

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

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 26, 2016

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

