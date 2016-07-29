# Skate Example

This document demonstrates using the [skate][] compiler transform.

To build this example install the command line interface `npm i -g trucks` and dependencies `npm i` then run:

```shell
trucks
```

Open `index.html` to see the rendered component or serve over HTTP with `node server.js` and visit `http://localhost:3000`.

---

- [Compiler Options](#compiler-options)
- [Source Files](#source-files)
- [Markup](#markup)
- [Compiler Output](#compiler-output)

---

## Compiler Options

```javascript
module.exports = {
  files: [__dirname + '/components.html'],
  transforms: ['trim', 'csp', 'skate/src', 'bundle'],
  out: '.',
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
        js: ['node_modules/skatejs/dist/index-with-deps.js']
      }
    }
  }
}
```

## Source Files

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
      <p onClick="titleClick" class="title">${this.title}</p>
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

## Markup

Example component usage:

```html
<!doctype html>
<html>
  <head>
    <script src="components.js"></script>
  </head>
  <body>
    <x-panel title="Languages" lang="English" values="English, French, Spanish">
      <p slot="content">Choose your language preference</p> 
    </x-panel>
  </body>
</html>
```

## Compiler Output

See [components.js](components.js) for the compiled output.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 29, 2016

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
[bundle]: https://github.com/tmpfs/trucks/blob/master/packages/transform-bundle
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

