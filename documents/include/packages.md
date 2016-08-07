The recommended way to package a component is to create an [npm][] package add a `components.html` entry point and `trucks.js` compiler configuration.

Once the package has been published to the registry it can be installed using the `npm:` protocol:

```shell
trucks npm://trucks-example-skate-component
```

```html
<link rel="import" href="npm://trucks-example-skate-component@^1.0.0">
```

Using [npm][] is the preferred mechanism for semantic versioning and so that component dependencies can be automatically resolved at compile time.

### Package Dependencies

If you need to add compiler plugins to your package you should add them to the `dependencies` section so that they are installed at compile time.

### Package Example

An example `package.json` and corresponding `trucks.js` compiler configuration:

<? @source {json} ../../examples/skate-component/package.json ?>

<? @source {javascript} ../../examples/skate-component/trucks.js ?>
