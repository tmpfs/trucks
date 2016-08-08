# Trucks Compiler

> Web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

## Install

```
npm i trucks-compiler --save-dev
```

***
<!-- @toc -->
***

## Usage

<? @source {javascript=s/(\.\.\/)+lib\/index/trucks-compiler/gm} usage.js ?>

## Plugins

<? @include ../../../documents/include/plugins.md ?>

## Options

This document shows the default options used when none are provided.

<? @source {javascript} ../defaults.js ?>

## API

<? @exec mkapi src/index.js src/state.js src/registry.js src/component.js src/logger.js src/middleware.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
