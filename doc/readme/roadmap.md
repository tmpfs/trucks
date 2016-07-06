## Roadmap

These features are not available yet however this section describes how they may be implemented.

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

