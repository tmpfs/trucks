## Example

This document demonstrates the compiler output. Developers that have configured the project can run `mk example` and open [index.html](https://github.com/tmpfs/trucks/blob/master/doc/example/index.html) to see the rendered component.

---

- [Example](#example)
  - [Source Files](#source-files)
  - [Compiler Options](#compiler-options)
  - [Javascript](#javascript)
  - [Stylesheet](#stylesheet)
  - [Markup](#markup)

---

### Source Files

Source component collection [components.html](https://github.com/tmpfs/trucks/blob/master/doc/example/components.html):

```html
<link rel="import" href="x-panel.html">
```

Component definition file [x-panel.html](https://github.com/tmpfs/trucks/blob/master/doc/example/x-panel.html):

```html
<dom-module id="x-panel">

  <template>

    <style>
      /*
        Inline styles for the shadow DOM.
      */
      * {
        font-family: sans-serif;
        color: white;
      }

      p, ::content p {
        margin: 0; 
        padding: 1em;
      }

      .title {
        background: black;
        cursor: pointer;
      }

      .content {
        min-height: 10em;
        background: gray;
      }

    </style>


    <div class="container">
      <p class="title">${this.title}</p>
      <div class="content">
        <slot name="content" />
      </div>
    </div>
  </template>


  <!--<template id="content">-->
  <!--</template>-->

  <script>
    skate.define('{{id}}', {
      events: {
        'click .container > .title' (elem/*, e*/) {
          console.log('clicked: ' + elem.tagName.toLowerCase());
        }
      },
      render: template
    });
  </script>
</dom-module>
```

### Compiler Options

```javascript
module.exports = {
  files: ['doc/example/components.html'],
  out: 'doc/example/build',
  force: true,
  compiler: {
    literals: true
  }
}
```

### Javascript

Compiled javascript:

```javascript
const templates = {
  "x-panel": function render(elem) {
    skate.vdom.element("style", () => {
      skate.vdom.text(` /* Inline styles for the shadow DOM. */ * { font-family: sans-serif; color: white; } p, ::content p { margin: 0; padding: 1em; } .title { background: black; cursor: pointer; } .content { min-height: 10em; background: gray; } `);
    });
    skate.vdom.element("div", {
      "class": `container`
    }, () => {
      skate.vdom.element("p", {
        "class": `title`
      }, () => {
        skate.vdom.text(`${ this.title }`);
      });
      skate.vdom.element("div", {
        "class": `content`
      }, () => {
        skate.vdom.element("slot", {
          "name": `content`
        }, () => {});
      });
    });
  }
};

function template(elem) {
  return templates[elem.tagName.toLowerCase()].call(elem, elem);
}

skate.define('x-panel', {
  events: {
    'click .container > .title' (elem/*, e*/) {
      console.log('clicked: ' + elem.tagName.toLowerCase());
    }
  },
  render: template
});
```

### Stylesheet

Compiled stylesheet:

```css

```

### Markup

```html
<!doctype html>
<html>
  <head>
    <!--<meta http-equiv="Content-Security-Policy" content="style-src 'self' 'nonce-Nc3n83cnSAd3wc3Sasdfn939hc3';">-->
    <meta http-equiv="Content-Security-Policy" content="style-src 'self' 'unsafe-inline';">
    <script src="skate-1.0.0-beta.7.js"></script>
    <script src="build/components.js"></script>
  </head>
  <body>
    <x-panel title="Panel Title">
      <p slot="content">Lorem ipsum</p> 
    </x-panel>
  </body>
</html>
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 9, 2016

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

