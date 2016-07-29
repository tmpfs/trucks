# Skate Example

This document demonstrates using the [skate][] compiler transform.

## Install

```
npm i trucks-example-skate-component
```

To build this example install the command line interface `npm i -g trucks` and dependencies `npm i` then run:

```shell
trucks
```

Open `index.html` to see the rendered component or serve over HTTP with `node server.js` and visit `http://localhost:3000`.

***
<!-- @toc -->
***

## Compiler Options

<? @source {javascript} trucks.js ?>

## Source Files

Component definition file:

<? @source {html} components.html ?>

## Markup

Example component usage:

<? @source {html} index.html ?>

## Compiler Output

See [components.js](components.js) for the compiled output.

<? @include ../../doc/readme/links.md ?>

