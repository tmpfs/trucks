# Trucks

<? @include badges.md ?>

> Framework agnostic, extensible web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

Designed primarily for [skatejs][] with support for [polymer][] coming soon.

Uses ES6 code transpiled for `node@4.x` compatibility.

## Install

```
npm i trucks-compiler --save-dev
```

For the command line interface run:

```
npm i -g trucks
```

## Getting Started

The quickest way to get started is to install the command line interface, compile a package and open `build/index.html` in a recent version of chrome.

```shell
trucks npm://trucks-example-skate-component -o build
```

Or from the file system:

```shell
trucks examples/skate-component/components.html -o build
```

In each case the [trucks.js](/examples/skate-component/trucks.js) compiler configuration file is used.

If `trucks.js` exists in the current working directory it is prepended to the list of configuration files:

```shell
cd examples/skate-component
trucks
```

***
<!-- @toc -->
***

<? @include
      plugin-list.md
      components.md
      license.md 
      links.md ?>
