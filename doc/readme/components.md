## Components

Component collections declare a group of components using HTML imports to allow related components to be grouped together.

```html
<link rel="import" href="x-icon.html">
<link rel="import" href="x-button.html">
```

These are the files you pass to the library when compiling components.

Components follow the [polymer][] style definition to encourage encapsulating all the aspects of a component into a single file:

```html
<template id="x-icon">
  <!-- template markup -->
</template>

<style>
  /* template styles */
</style>

<script>
  /* component definition and logic */
</script>
```

During compilation all `<template>` elements are concatenated to an HTML file, styles are concatenated into a stylesheet and scripts are concatenated into a javascript file.

You can then include the resulting component files in your HTML page(s):

```html
<link rel="stylesheet" href="components.css">
<script src="components.js"></script>
```

Complex components can reference external files if you prefer:

```html
<link rel="template" href="x-icon-template.html">
<link rel="stylesheet" href="x-icon.css">
<script src="x-icon.js"></script>
```

Note that the `rel` attribute is set to `template` rather than `import` when referencing external `<template>` elements from component files so that recursive component imports can be supported.

### Dependencies

Components can declare dependencies on other components using an HTML import in the component file. Consider a button component that depends upon an icon component; first define the component collection `components.html`:

```html
<link rel="import" href="x-button.html">
```

Then define the button component and import the icon component dependency `x-button.html`:

```html
<import rel="import" href="x-icon.html">

<template id="x-button">
  <x-icon><x-icon>
</template>

<!-- implement component styles and script -->
```

And define the component dependency `x-icon.html`:

```html
<!-- implement component markup, styles and script -->
```

### Notes

Components defined for [skatejs][] can ignore the HTML file as the templates are compiled to javascript; the command line interface will not generate an HTML file as it compiles for [skatejs][] by default.

When authoring components using [polymer][] you would need to include the resulting HTML page containing all `<template>` elements in to your HTML page(s), how you do this depends upon your build process. Use the `--extract` option when compiling with the command line interface to also generate an HTML file containing the template elements.


