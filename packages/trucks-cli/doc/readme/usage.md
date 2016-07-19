## Usage

To compile components pass HTML source files, for example:

```shell
trucks src/*.html
```

Which will generate `components.css`, `components.js` and `components.html` in the current working directory. Template elements in the source component files are compiled to javascript functions and prepended to `components.js`.

In this case the HTML templates are not compiled to javascript. Use this option when compiling [polymer][] components.

Change the output directory with the `--out` option:

```shell
trucks src/*.html -o build
```

The output file name is `components` by default; use the `--name` option to change the name of the generated files.

Configuration files can be loaded and merged with the default options using the `--conf` option:

```shell
trucks src/*.html -o build --conf options.js
```

See [OPTIONS](/doc/OPTIONS.md) for the options that may be specified in configuration files.

For full cli documentation see the [man page](/packages/trucks-cli/doc/man/trucks.1) and consult the [trucks][] readme for information on creating components.

