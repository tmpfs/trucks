# CSP Transform

> Content security policy nonce and sha checksums

For each style and script in the shadow DOM add a `nonce` attribute and create content security policy HTML and text files alternatively you can use the `sha` option to avoid the use of attributes but you should be certain the elements will not be processed further otherwise the checksums might not match.

The generated text file is suitable for including as an HTTP header:

```
style-src 'self' 'nonce-9566b05df2a2e6503449f5de138e151f51a17ceb'; script-src 'self' 'nonce-fc76f6ed5eb71e5b9ceeb1298b7458e6d1bced7d'
```

The generated HTML file contains a `<meta>` element, for example:

```html
<meta http-equiv="Content-Security-Policy" content="style-src 'self' 'nonce-9566b05df2a2e6503449f5de138e151f51a17ceb'; script-src 'self' 'nonce-fc76f6ed5eb71e5b9ceeb1298b7458e6d1bced7d'">
```

## Install

```
npm i trucks-transform-csp --save-dev
```

For the command line interface see [trucks-cli][].

---

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [csp](#csp)
- [License](#license)

---

## Usage

Use the `csp` key to configure this transform:

```javascript
const trucks = require('trucks');

trucks(
  {
    files: ['components.html'],
    transforms: ['csp'],
    conf: {
      transforms: {
        csp: {
          sha: 'sha512',
          dir: 'build/csp'
        } 
      }
    }
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
```

## API

### csp

```javascript
public csp(state, conf)
```

Generates content security policy files for styles and scripts within the
shadow DOM.

Each type is mapped to either a `style_src` or `script_src` policy using a
prefix of `'self'` unless disabled using the `self` option.

Unless the `sha` option is given the operation is in `nonce` mode which
adds a `nonce` attribute to the matched elements, if the intention is to
further process via the skate compiler you should enable the `statics`
option so that the attribute is set as `data-static-nonce`.

When the `sha` option is specified attributes are not added but the output
will be base64 encoded computed hashes of each element's content.

Generates the files `csp.html` containing a `<meta>` element describing
the content security policy and a `csp.txt` file containing a value
suitable for appending to a `Content-Security-Policy` HTTP header.

Use the `dir`, `text` and `html` options to change the output locations.

When `dir` is not given the default output directory is used.

Returns map of visitor functions.

See https://www.w3.org/TR/CSP2/.

* `state` Object compiler state.
* `conf` Object transform plugin configuration.

#### Options

* `self` Boolean=true include `'self'` in the output.
* `styles` Boolean=true generate csp for styles.
* `scripts` Boolean=true generate csp for scripts.
* `sha` String use sha algorithm (sha256, sha384 or sha512).
* `text` String=csp.txt name of the text output file.
* `html` String=csp.html name of the html output file.
* `dir` String override default output directory.
* `statics` Boolean=false prefix attributes with `data-static-`.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 20, 2016

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
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

