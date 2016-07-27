## Overview

The library takes an HTML template and compiles it to a `render` function.

An HTML template such as:

<? @source {html} overview-template.html ?>

Will result in the compiled function:

<? @exec {javascript} node doc/readme/overview-template.js ?>

Note that whitespace in the source template is normalized by default.

The compiler then creates a map of component identifiers to template render functions:

<? @exec {javascript} node doc/readme/overview-template-map.js ?>

And exposes a main function that performs a lookup in the template map by element tag name:

<? @exec {javascript} node doc/readme/overview-template-main.js ?>

Component authors may now proxy the `render` function to the `template` function, for example:

```javascript
skate.define('x-blog-post', {
  render: template
});
```

This compile phase is not required for [polymer][] components as they already use HTML templates.
