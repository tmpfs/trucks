## Example

This document demonstrates the compiler output.

---

- [Example](#example)
  - [Source Files](#source-files)
  - [Compiler Options](#compiler-options)
  - [Javascript](#javascript)
  - [Stylesheet](#stylesheet)
  - [Markup](#markup)

---

### Source Files

Source component files:

* [components.html](https://github.com/tmpfs/trucks/blob/master/doc/example/components.html)
* [x-panel.html](https://github.com/tmpfs/trucks/blob/master/doc/example/x-panel.html)

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
    skate.vdom.element("p", () => {
      skate.vdom.text(`${ elem.title }`);
    });
    skate.vdom.element("div", {
      class: `content`
    });
  }
};

function template(elem) {
  return templates[elem.tagName.toLowerCase()](elem);
}

skate.define('x-panel', {render: template});
```

### Stylesheet

Compiled stylesheet:

```css
:host(.panel) {
  max-width: 10em; 
}

/*
  @deprected /deep/ selector
  
  There does not appear to be a consensus on external styles 
  for the Shadow DOM.

  @see https://github.com/w3c/webcomponents
  @see https://github.com/w3c/webcomponents/issues/468
  @see https://drafts.csswg.org/css-scoping/#selectors
  @see https://drafts.csswg.org/css-scoping/#shadow-dom
  @see https://www.chromestatus.com/features/6750456638341120
 */
x-panel /deep/ p {
  margin: 0;
  font-family: sans-serif;
  padding: 1em;
  background: black;
  color: white;
}

x-panel /deep/ .content {
  min-height: 10em;
  background: gray;
}
```

### Markup

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="build/components.css">
    <script src="skate-1.0.0-beta.7.js"></script>
    <script src="build/components.js"></script>
  </head>
  <body>
    <x-panel class="panel" title="Panel Title"></x-panel>
  </body>
</html>
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 6, 2016

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

