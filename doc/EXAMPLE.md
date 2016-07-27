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

Component definition file [components.html](https://github.com/tmpfs/trucks/blob/master/doc/example/components.html):

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
        <slot name="content"></slot>
        <ul class="items">
          <script>
            this.values.forEach((item) => {
              html("<li>${item}</li>"); 
            })
          </script>
        </ul>
      </div>
    </div>
  </template>


  <script>
    skate.define('{{id}}', {
      props: {
        values: {
          attribute: true,
          deserialize (val) {
            return val.split(/\s*,\s*/);
          },
          serialize (val) {
            return val.join(',');
          }
        }
      },
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
  transforms: ['trim', 'csp', 'skate'],
  out: 'doc/example/build',
  force: true,
  conf: {
    transforms: {
      csp: {
        sha: 'sha256',
        statics: true 
      },
      skate: {
        literals: true
      }
    }
  }
}
```

### Javascript

Compiled javascript:

```javascript
const templates = {
  "x-panel": function render(elem) {
    skate.vdom.element("style", () => {
      skate.vdom.text("/*\n  Inline styles for the shadow DOM.\n*/\n* {\n  font-family: sans-serif;\n  color: white;\n}\n\np, ::content p {\n  margin: 0; \n  padding: 1em;\n}\n\n.title {\n  background: black;\n  cursor: pointer;\n}\n\n.content {\n  min-height: 10em;\n  background: gray;\n}");
    });
    skate.vdom.element("div", {
      "class": "container"
    }, () => {
      skate.vdom.element("p", {
        "class": "title"
      }, () => {
        skate.vdom.text(`${ this.title }`);
      });
      skate.vdom.element("div", {
        "class": "content"
      }, () => {
        skate.vdom.element("slot", {
          "name": "content"
        });
        skate.vdom.element("ul", {
          "class": "items"
        }, () => {
          this.values.forEach(item => {
            skate.vdom.element("li", () => {
              skate.vdom.text(`${ item }`);
            });
          });
        });
      });
    });
  }
};

function template(elem) {
  return templates[elem.tagName.toLowerCase()].call(elem, elem);
}

skate.define('x-panel', {
  props: {
    values: {
      attribute: true,
      deserialize (val) {
        return val.split(/\s*,\s*/);
      },
      serialize (val) {
        return val.join(',');
      }
    }
  },
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
    <script src="skate-1.0.0-beta.7.js"></script>
    <script src="build/components.js"></script>
  </head>
  <body>
    <x-panel title="Panel Title" values="Apple,Oranges,Pears">
      <p slot="content">Lorem ipsum</p> 
    </x-panel>
  </body>
</html>
```

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

