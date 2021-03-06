## Components

---

- [Components](#components)
  - [Templates](#templates)
    - [Template Styles](#template-styles)
  - [Style Scopes](#style-scopes)
  - [Dependencies](#dependencies)
  - [Private Dependencies](#private-dependencies)

---

Components follow the [polymer][] style definition to encourage encapsulating all the aspects of a component into a single file:

```html
<!-- @component x-component -->
<dom-module id="x-component">
  <template>
    <style>
      /* component styles (shadow scope) */
    </style>
    <!-- template markup -->
  </template>

  <style>
    /* global styles (document scope) */
  </style>

  <script>
    /* component definition and logic */
  </script>
</dom-module>

<!-- @usage -->
<x-component></x-component>
```

To allow related components to be grouped together you may wish to use an index file:

```html
<link rel="import" href="x-icon.html">
<link rel="import" href="x-button.html">
```

Complex components can reference external files if you prefer which is particularly useful for editors that automatically lint javascript and stylesheets:

```html
<dom-module id="x-icon">
  <link rel="template" href="x-icon-template.html">
  <link rel="stylesheet" href="x-icon.css">
  <script src="x-icon.js"></script>
</dom-module>
```

Note the use of the `rel="template"` attribute if you want to use an external HTML file for the component template.

To include the resulting component files in your HTML page(s) load the compiled styles and javascript:

```html
<link rel="stylesheet" href="components.css">
<script src="components.js"></script>
```

### Templates

The parser differentiates between a primary template and template partials. The primary template is one with no `id` attribute (it inherits from the `<dom-module>` identifier) whilst partials are those with identifiers:

```html
<dom-module id="x-button">
  <!-- primary template -->
  <template></template>
  <!-- template partial -->
  <template id="icon"></template>
</dom-module>
```

There may only be one primary template in a module.

#### Template Styles

Because all styles within templates should be applied to the shadow DOM when styles are declared in multiple templates they may be hoisted, for example:

```html
<dom-module id="x-button">
  <template>
    <style>
      p {margin: 0;}
    </style>
  </template>
  <template id="icon">
    <style>
      i {padding: 0;}
    </style>
  </template>
</dom-module>
```

Is equivalent to:

```html
<dom-module id="x-button">
  <template>
    <style>
      p {margin: 0;}
      i {padding: 0;}
    </style>
  </template>
</dom-module>
```

### Style Scopes

Style elements whether they are inline (`<style>`) or external (`<link>`) are given a scope, when they are directly within the `<dom-module>` element they are deemed to be of a document scope and are written to the primary output stylesheet.

```html
<dom-module id="x-icon">
  <style>
    /* global styles (document scope) written to `components.css` */
  </style>
</dom-module>
```

When the style element appears within a `<template>` element it is deemed to be a component style and given a shadow scope. These styles should be written within the shadow DOM to ensure they are applied correctly.

```html
<dom-module id="x-icon">
  <template>
    <style>
      /* component styles (shadow scope) written to the shadow DOM for the component */
    </style>
  </template>
</dom-module>
```

The shadow scope is preferred but you can use the document scope if you need to use shadow piercing selectors to style the component:

```html
<dom-module id="x-icon">
  <template>
    <em>${this.title}</em>
  </template>
  <style>
    x-icon /deep/ em {
      font-size: 2rem;
    }
  </style>
</dom-module>
```

Note that the `/deep/` and `::shadow` selectors are deprecated and should be avoided.

### Dependencies

Components can declare dependencies on other components using an HTML import in the component file. Consider a button component that depends upon an icon component; first define the component collection `components.html`:

```html
<link rel="import" href="x-button.html">
```

Then define the button component and import the icon component dependency `x-button.html`:

```html
<import rel="import" href="x-icon.html">

<dom-module id="x-button">
  <template>
    <x-icon><x-icon>
  </template>

  <!-- implement component styles and script -->
</dom-module>
```

And define the component dependency `x-icon.html`:

```html
<dom-module id="x-icon">
  <!-- implement component markup, styles and script -->
</dom-module>
```

### Private Dependencies

A component file can declare multiple components in a single file which can be useful when a component's dependencies are not intended to be used independently. In this case they are referred to as *private dependencies*, for example:

```html
<dom-module id="x-icon">
  <template>
    <!-- component markup -->
  </template>

  <style>
    x-icon {
      /* styles for icon component */
    }
  </style>

  <script>
    skate.define('{{id}}', {/* component implementation */});
  </script>
</dom-module>

<dom-module id="x-button">
  <template>
    <x-icon><x-icon>
  </template>

  <style>
    x-button {
      /* styles for button component */
    }
  </style>

  <script>
    skate.define('{{id}}', {/* component implementation */});
  </script>
</dom-module>
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
[manual-standalone]: https://github.com/tmpfs/trucks/blob/master/manual/standalone.md
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

