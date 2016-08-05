## Plugin List

Plugins are in [packages](/packages).

### Core

The [trucks-compiler][] library provides the core functionality; it bundles plugins for each compiler phase:

* [load][] Read the HTML import tree.
* [parse][] Parse the `<dom-module>` elements.
* [transform][] Run tree transformations.
* [generate][] Create output file contents.
* [write][] Write output files to disc.

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

* [style-extract][] Write stylesheets for each component.
* [style-inject][] Read and overwrite stylesheets for each component.

### Generators

* [page][generator-page] Inject output files into HTML templates.

### Miscellaneous

* [csp][transform-csp] Content security policy transformations.
* [bundle][] Bundle input files with the generated output files.
* [copy][] Copy input files to the output directory.
* [tree][] Humanize the component tree using [archy][].
* [usage][] Generate component usage examples.

