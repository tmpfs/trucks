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
<link rel="import" href="x-icon-template.html">
<link rel="stylesheet" href="x-icon.css">
<script src="x-icon.js"></script>
```

Components defined for [skatejs][] can ignore the HTML file as the templates are compiled to javascript.

When authoring components using [polymer][] you would need to include the resulting HTML page containing all `<template>` elements in to your HTML page(s), how you do this depends upon your build process.


