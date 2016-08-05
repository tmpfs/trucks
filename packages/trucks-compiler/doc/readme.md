# Trucks Compiler

> Web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme}
      usage.md 
      plugins.md ?>

## Options

This document shows the default options used when none are provided.

<? @source {javascript} ../defaults.js ?>

## API

<? @exec mkapi src/** --level=3 ?>

## Documents

Some background on motivation and rationale is in the [INTRO](/packages/trucks-compiler/doc/INTRO.md).

For insights into the compiler phases and data structures see [COMPILER](/packages/trucks-compiler/doc/COMPILER.md).

<? @include {=readme}
      license.md
      links.md ?>
