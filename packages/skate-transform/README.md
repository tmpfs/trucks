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

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 17, 2016

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

