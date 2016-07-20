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

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
