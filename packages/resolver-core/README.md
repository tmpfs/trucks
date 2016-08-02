# Resolver

> Abstract HTML import resolver

Implementation contract for protocol resolver plugins.

## Install

```
npm i trucks-resolver-core --save
```

---

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [Resolver](#resolver)
- [License](#license)

---

## Usage

Resolver plugin implementations should extend this class, see the [file][resolver-file] and [http][resolver-http] plugins for example implementations.

## API

### Resolver

Abstract protocol resolver.

Resolver plugin implementations should create a subclass of this class and
invoke `registry.register()` with a protocol and the derived class.

#### Resolver

```javascript
public Resolver(state, href[, parent])
```

Create a resolver.

The `file` property is initialized to the canonical path for
the `href` argument.

* `state` Object compiler state.
* `href` String source URL to resolve.
* `parent` Object a parent resolver.

##### Throws

* `TypeError` attempting to parse a bad href argument.

#### protocol

```javascript
String protocol
```

Get the protocol from the `href` assigned to this
resolver, if no protocol is found lookup is performed
in a parent hierarchy.

#### file

```javascript
String file
```

Absolute computed path for the URL.

This is initialized to the canonical path for the `href` argument
passed to the constructor but implementations may overwrite this.

#### resolve

```javascript
public resolve(cb)
```

Resolve the contents for the URL.

Implementors should invoke callback with an error and `Buffer` contents
or an object representing compiler options:

`(err, contents) => {}`.

When the callback is invoked with compiler options it is treated as a
nested compile pass using the given options which should have an input
`files` array.

* `cb` Function callback function.

#### getCanonicalPath

```javascript
public getCanonicalPath()
```

Get a canonical path for the URL, used to determine if the
resource has already been processed.

Typically implementors would convert this to an absolute path or
absolute URL to ensure that duplicates can be resolved.

Returns the canonical file path to resolve.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 2, 2016

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

