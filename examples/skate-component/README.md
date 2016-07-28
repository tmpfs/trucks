# Skate Example

This document demonstrates using the [skate][] compiler transform.

---


  - [Compiler Options](#compiler-options)
  - [Source Files](#source-files)
  - [Markup](#markup)- [Developer](#developer)

---

### Compiler Options

```javascript
module.exports = {
  files: [__dirname + '/components.html'],
  transforms: ['trim', 'csp', 'skate', 'bundle'],
  out: 'build',
  force: true,
  css: false,
  html: false,
  conf: {
    transforms: {
      csp: {
        sha: 'sha256',
        statics: true 
      },
      bundle: {
        js: ['../../node_modules/skatejs/dist/index-with-deps.js']
      }
    }
  }
}
```

### Source Files

Component definition file:

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
      <p onclick="titleClick" class="title">${this.title}</p>
      <div class="content">
        <slot name="content"></slot>
        <ul class="items">
          <script>
            this.values.forEach((item) => {
              html(`<li>${item}</li>`); 
            })
          </script>
        </ul>
        <script>
          if(this.lang) {
            partial('current');
          }
        </script>
      </div>
    </div>
  </template>

  <template id="current">
    <p>Current language: <em>${this.lang.toLowerCase()}</em></p> 
  </template>

  <script>

    function titleClick(e) {
      console.log('click: ' + e.currentTarget.tagName.toLowerCase());
    }

    skate.define('{{id}}', {
      props: {
        lang: {
          attribute: true 
        },
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
      render: template
    });
  </script>
</dom-module>
```

### Markup

Example component usage:

```html
<!doctype html>
<html>
  <head>
    <script src="build/components.js"></script>
  </head>
  <body>
    <x-panel title="Languages" lang="English" values="English, French, Spanish">
      <p slot="content">Choose your language preference</p> 
    </x-panel>
  </body>
</html>
```

## Developer

Developers that have configured the project can run `mk` and open `index.html` to see the rendered component, run `node server.js` and visit `http://localhost:3000` to serve over HTTP.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 28, 2016

[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: /packages/trucks-cli
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
[sources]: /packages/plugin-sources
[load]: /packages/plugin-load
[parse]: /packages/plugin-parse
[transform]: /packages/plugin-transform
[generate]: /packages/plugin-generate
[write]: /packages/plugin-write
[transform-csp]: /packages/transform-csp
[skate]: /packages/transform-skate
[stylus]: /packages/transform-stylus
[less]: /packages/transform-less
[sass]: /packages/transform-sass
[trim]: /packages/transform-trim
[tree]: /packages/transform-tree
[style-extract]: /packages/transform-style-extract
[style-inject]: /packages/transform-style-inject
[resolver-core]: /packages/resolver-core
[resolver-file]: /packages/resolver-file
[resolver-http]: /packages/resolver-http
[resolver-npm]: /packages/resolver-npm
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

