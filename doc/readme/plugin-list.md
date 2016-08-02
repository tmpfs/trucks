## Plugin List

Plugins are in [packages](/packages).

### Compilers

* [skate][] Compiles HTML templates to render functions.

### Resolvers

* [core][resolver-core] Abstract class for resolver plugins.
* [file][resolver-file] Default resolver for the `file:` protocol.
* [http][resolver-http] Resolver for the `http:` and `https:` protocols.
* [npm][resolver-npm] Resolver for the `npm:` protocol.

### Preprocessors

* [less][] Preprocess less sources.
* [sass][] Preprocess sass sources.
* [stylus][] Preprocess stylus sources.
* [trim][] Trim whitespace from inline styles and scripts.

### Styles

* [csp][transform-csp] Content security policy transformations.
* [style-extract][] Write stylesheets for each component.
* [style-inject][] Read and overwrite stylesheets for each component.

### Miscellaneous

* [bundle][] Bundle input files with the generated output files.
* [copy][] Copy input files to the output directory.
* [tree][] Humanize the component tree using [archy][].

