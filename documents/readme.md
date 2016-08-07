# Trucks

<? @include badges.md ?>

> Framework agnostic, extensible web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

Designed primarily for [skatejs][] with support for [polymer][] coming soon.

## Install

To install the command line interface run:

```
npm i -g trucks
```

To use the compiler library programatically:

```
npm i trucks-compiler --save-dev
```

See [trucks-compiler][] for usage and more documentation.

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

***
<!-- @toc -->
***

## Manual

More documentation is in the [manual][] also available on a [single page][manual-standalone].

## Examples

Component projects are in the [examples][] directory.

<? @include plugin-list.md ?>

<? @include
    license.md 
    links.md ?>
