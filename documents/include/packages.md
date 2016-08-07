The recommended way to package a component is to create an [npm][] package add a `components.html` entry point and `trucks.js` compiler configuration.

Once the package has been published to the registry it can be compiled using the `npm:` protocol:

```shell
trucks npm://trucks-example-skate-component
```

Or added as a dependency:

```html
<link rel="import" href="npm://trucks-example-skate-component@^1.0.0">
```

Using [npm][] is the preferred mechanism for semantic versioning support and so that component dependencies can be automatically resolved at compile time.

### Private Packages

In a corporate environment you may need to share components without exposing them to the public; you can either configure a private [npm][] registry or serve component packages from an internal web server and use the `https:` protocol.

### Package Dependencies

If you need to add compiler plugins to your package you should add them to the `dependencies` section so that they are installed at compile time.

### Package Example

An example `package.json` and corresponding `trucks.js` compiler configuration:

<? @source {json} ../../examples/skate-component/package.json ?>

<? @source {javascript} ../../examples/skate-component/trucks.js ?>
