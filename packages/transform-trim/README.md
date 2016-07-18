# Trim Transform

> Removes leading whitespace from inline content

Designed to prettify inline content so that styles and scripts have leading whitespace removed:

```html
<dom-module id="x-blog-post">
  <script>
    skate.define('{{id}}', {});
  </script>
</dom-module>
```

Yields script content without the leading indentation:

```javascript
skate.define('{{id}}', {});
```

Using this transform is not typically necessary as you would ordinarily build to a minified file (possibly with source maps) however it is used internally to simplify test assertions.

## Install

```
npm i trucks-transform-trim --save-dev
```

For the command line interface see [trucks-cli][].

---

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [trim](#trim)
- [License](#license)

---

## Usage

Programmatic usage:

```javascript
const trucks = require('trucks');

trucks(
  {
    files: ['example/components.html'],
    transforms: ['trim']
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
```

For command line usage see [trucks-cli][].

## API

### trim

```javascript
public trim(state, conf)
```

Removes leading and trailing whitespace from inline styles and scripts.

When the `lines` option is given each line is stripped of leading
whitespace that matches the `pattern` regular expression.

Returns map of visitor functions.

* `state` Object compiler state.
* `conf` Object transform plugin configuration.

#### Options

* `inline` Boolean=true only replace inline elements.
* `lines` Boolean=true strip each line.
* `pattern` RegExp used for line whitespace.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 18, 2016

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
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

