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

<? @include {=readme}
      install.md  ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
