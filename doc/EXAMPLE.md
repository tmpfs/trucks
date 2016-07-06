## Example

This document demonstrates the compiler output.

---

- [Example](#example)
  - [Source Files](#source-files)
  - [Compiler Options](#compiler-options)
  - [Stylesheet](#stylesheet)
  - [Javascript](#javascript)

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

### Stylesheet

```css
x-panel {
  background: black;
  color: white;
}
```

### Javascript

```javascript
const templates = {
  "x-panel": function render(elem) {
    skate.vdom.element("p", {
      class: `title`
    }, () => {
      skate.vdom.text(`${ elem.title }`);
    });
  }
};

function template(elem) {
  return templates[elem.tagName.toLowerCase()](elem);
}

skate.define('x-panel', {render: template});
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

