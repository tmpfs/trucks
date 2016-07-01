## Overview

The library takes an HTML template and compiles it to a `render` function.

An HTML template such as:

<? @source {html} overview-template.html ?>

Will result in the compiled function:

<? @exec {javascript} node doc/readme/overview-template.js ?>

Note that whitespace in the source template is normalized by default and that support for template literals needs to be enabled when compiling.
