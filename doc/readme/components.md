## Components

Components follow the [polymer][] style definition to encourage encapsulating all the aspects of a component into a single file:

```html
<dom-module id="x-icon">
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
  <!-- template partial, fully qualified id: x-button-icon -->
  <template id="icon"></template>
</dom-module>
```

There may only be one primary template in a module and template partial `id` attributes are prefixed with the component identifier.

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

