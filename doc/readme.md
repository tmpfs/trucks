# Trucks

<? @include readme/badges.md ?>

> Web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

Designed primarily for [skatejs][] with support for [polymer][] coming soon.

Uses ES6 code transpiled for `node@4.x` compatibility.

<? @include {=readme} install.md ?>

## Getting Started

The quickest way to get started is to install the command line interface and compile a package:

```shell
mkdir build
trucks npm://trucks-example-skate-component -o build
```

***
<!-- @toc -->
***

<? @include {=readme}
      usage.md 
      plugin-list.md
      components.md
      plugins.md
      resolvers.md
      transforms.md ?>

## Documents

Some background on motivation and rationale is in the [INTRO](/doc/INTRO.md).

An example for [skatejs][] is in [skate-component](/examples/skate-component).

For the API docs see [API](/doc/API.md), an overview of the available options is in [OPTIONS](/doc/OPTIONS.md). For insights into the compiler phases and data structures see [COMPILER](/doc/COMPILER.md).

The [ROADMAP](/doc/ROADMAP.md) has some ideas for future features.

Information on how to build this project is in [DEVELOPER](/doc/DEVELOPER.md).

<? @include {=readme}
      license.md
      links.md ?>
