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
