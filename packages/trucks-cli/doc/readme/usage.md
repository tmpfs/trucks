## Usage

To compile components to the current working directory:

```shell
trucks src/*.html
```

Will generate `components.html`, `components.css` and `components.js` in the current working directory. The output file name is `components` by default use the `--name` option to change the name of the generated files.

Use the `--out` option to specify the output directory:

```shell
trucks src/*.html -o build
```

Configuration files can be loaded and merged with the default options using the `--conf` option:

```shell
trucks src/*.html -o build --conf options.js
```

See [OPTIONS](/doc/OPTIONS.md) for the options that may be specified in configuration files.

For full cli documentation see the [man page](/packages/trucks-cli/doc/man/trucks.1) and consult the [trucks][] readme for programmatic usage and more information.
