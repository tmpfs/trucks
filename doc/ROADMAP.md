## Roadmap

These features are not available yet however this section describes how they may be implemented.

---

- [Roadmap](#roadmap)
  - [Packages](#packages)
  - [Styles](#styles)
  - [Documentation](#documentation)

---

### Packages

Sharing web components in a package manager agnostic format would be very useful. Currently component groups only support loading from the local filesystem but this should be refactored to a plugin system that maps to a scheme URL allowing loading components from various locations.

For example we could register a `trucks-npm` plugin and load components from [npm][] packages:

```html
<link rel="import" href="npm://@scope/package">
```

Suggested schemes to implement:

* `npm://`
* `https://`
* `git+ssh://`

Later support could be added for:

* `bower://`
* `jspm://`
* `component://`

### Styles

Whilst experimenting with [polymer][] it was noticed that there is a certain amount of redundancy when styling components authored by third parties. Component authors need to provide default styles for their components whilst component consumers normally need to modify the default styles.

It would not be very difficult to allow a pre-compile phase that maps component identifiers to stylesheets that can replace or be merged with the default styles provided by the component author.

This would reduce the file size of component styles and prevent consumers from battling against CSS specificity issues when attempting to override the default component styles.

The suggestion is that this would be implemented as [postcss plugins][postcss].

### Documentation

Component authors should have a consistent approach to writing documentation for the created components so that users can easily see the component attributes, events and other aspects of the component (dependencies etc).

The suggestion is that in the future we could use the [mkapi][] and [mkparse][] libraries to generate markdown documentation for components, a draft idea of how this would look:

```html
<!--
  Video player component.

  @component x-video

  @attr {Boolean} playing start or stop the video playback.

  @event start emitted when the video starts playing.
  @event stop emitted when the video stops playing.

  @dependency x-play-button 
  @dependency x-volume-button 
  @dependency x-slider
-->
<x-video playing></x-video>

<template id="x-video">
  <!-- component markup -->
</template>

<style>
  /* component styles */
</style>

<script>
  /* component implementation */
</script>
```

The generated markdown document would render the documentation comments followed by fenced code blocks showing the example usage(s) and the component implementation, these pages could then be converted to HTML (with source code higlighting) to be published online as static web pages.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 29, 2016

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
[bundle]: https://github.com/tmpfs/trucks/blob/master/packages/transform-bundle
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

