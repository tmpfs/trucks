## Packages

---

- [Packages](#packages)
  - [Private Packages](#private-packages)
  - [Package Dependencies](#package-dependencies)
  - [Package Example](#package-example)
    - [package.json](#packagejson)
    - [trucks.js](#trucksjs)

---

The recommended way to package a component is to create an [npm][] package add a `components.html` entry point and `trucks.js` compiler configuration.

Once the package has been published to the registry it can be compiled using the `npm:` protocol:

```shell
trucks npm://trucks-example-skate-component
```

Or added as a dependency:

```html
<link rel="import" href="npm://trucks-example-skate-component@^1.0.0">
```

Using [npm][] is the preferred mechanism for semantic versioning support and so that component dependencies can be automatically resolved at compile time.

### Private Packages

In a corporate environment you may need to share components without exposing them to the public; you can either configure a private [npm][] registry or serve component packages from an internal web server and use the `https:` protocol.

### Package Dependencies

If you need to add compiler plugins to your package you should add them to the `dependencies` section so that they are installed at compile time.

### Package Example

An example package descriptor and corresponding compiler configuration is shown below.

#### package.json

```json
{
  "name": "trucks-example-skate-component",
  "version": "1.0.5",
  "description": "Skate compiler transform example",
  "author": "muji <noop@xpm.io>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tmpfs/trucks"
  },
  "engines": {
    "node": ">=4.0"
  },
  "dependencies": {
    "skatejs": "~1.0.0-beta.19",
    "trucks-generator-page": "~1.0.1",
    "trucks-transform-bundle": "*",
    "trucks-transform-csp": "*",
    "trucks-transform-skate": "*",
    "trucks-transform-trim": "*",
    "trucks-transform-usage": "*"
  },
  "devDependencies": {
    "express": "~4.14.0"
  },
  "scripts": {
    "clean": "rm -rf build",
    "prebuild": "npm run clean",
    "build": "trucks"
  }
}
```

#### trucks.js

```javascript
const options = {
  files: [__dirname + '/components.html'],
  transforms: ['trim', 'csp', 'skate', 'bundle', 'usage'],
  generators: ['page'],
  out: 'build',
  force: true,
  css: false,
  html: false,
  page: {
    files: {
      'template.html': 'index.html'
    } 
  },
  write: {
    exclude: /\.?usage.html$/
  },
  conf: {
    transforms: {
      csp: {
        sha: 'sha256',
        statics: true 
      },
      bundle: {
        js: [require.resolve('skatejs/dist/index-with-deps.js')]
      }
    }
  }
}

module.exports = options;
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 8, 2016

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
[manual]: https://github.com/tmpfs/trucks/blob/master/manual
[examples]: https://github.com/tmpfs/trucks/blob/master/examples
[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
[trucks-compiler]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler
[sources]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-sources
[load]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-load
[parse]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-parse
[transform]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-transform
[generate]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-generate
[write]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-write
[transform-csp]: https://github.com/tmpfs/trucks/blob/master/packages/transform-csp
[bundle]: https://github.com/tmpfs/trucks/blob/master/packages/transform-bundle
[copy]: https://github.com/tmpfs/trucks/blob/master/packages/transform-copy
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[usage]: https://github.com/tmpfs/trucks/blob/master/packages/transform-usage
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[generator-page]: https://github.com/tmpfs/trucks/blob/master/packages/generator-page
[standalone-manual]: https://github.com/tmpfs/trucks/blob/master/manual/standalone.md
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

