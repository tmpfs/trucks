# Load

> Reads the web component import tree

Reads HTML imports into the component tree resolving files using the registered protocol plugins.

```html
<link rel="import" href="components.html">
```

When protocol plugins are defined as strings and do not resolve to an absolute path they are deemed to be modules to require and are prefixed with `trucks-resolver-` such that `http` will require the `trucks-resolver-http` package.

See the [core][resolver-core], [file][resolver-file], [http][resolver-http] and [npm][resolver-npm] protocol resolver plugins.

## Install

```
npm i trucks-plugin-load --save-dev
```

---

- [Install](#install)
- [Usage](#usage)
- [Resolvers](#resolvers)
- [API](#api)
  - [load](#load)
- [License](#license)

---

## Usage

This plugin is bundled with the core [trucks-compiler][] library.

If a `protocols` array is declared on the options it is used:

```javascript
const options = {
  protocols: ['file']
}
```

Configure this plugin using the `load` field:

```javascript
const options {
  conf: {
    plugins: {
      load: {
        /* plugin configuration */
      }
    }
  }
}
```

Or as a convenient shortcut use the top-level `load` field:

```javascript
const options {
  load: {
    /* plugin configuration */
  }
}
```

## Resolvers

Resolver plugins are mapped to URL protocols and allow the file load mechanism to be extended so that users can distribute and install web components from remote resources or implement custom protocols.

By default a protocol handler for the `file:` scheme is registered by the [load][] plugin so HTML imports can be loaded from the local file system.

To enable a resolver first install the package (`npm i trucks-resolver-http --save-dev`) and then enable the plugin in the `protocols` list:

```javascript
const options = {
  files: ['components.html'],
  protocols: ['http']
}
```

You can now use HTTP and HTTPS imports:

```html
<link rel="import" href="https://domain.com/components.html">
```

Plugin functions are invoked synchronously before the [load][] plugin executes; they allow HTML imports to be mapped to different protocols.

The signature for resolver plugins is:

```javascript
function ftp(state, conf) {
  return (registry) => {
    registry.register('ftp:', FtpResolver); 
  }
}
```

Plugins must register a subclass of the [core resolver][resolver-core].

See the [file resolver][resolver-file] and [http resolver][resolver-http] for example classes and plugin functions.

## API

### load

```javascript
public load(state, conf)
```

Load HTML import files and create entries in the compiler state `tree`.

When a list of protocol plugins is given they are invoked when this plugin
is initialized passing the compiler state registry so that the resolver
plugins may register protocol scheme handlers.

If no protocols list is given the default `file:` protocol is enabled.

If a protocols list is given and does not contain the default `file:`
protocol it is prepended to the list.

Returns plugin closure.

* `state` Object compiler state.
* `conf` Object plugin configuration.

#### Options

* `protocols` Array list of protocol resolver plugins.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 5, 2016

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

