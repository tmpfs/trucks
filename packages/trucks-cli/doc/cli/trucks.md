# Name

trucks - compiles web components

# Synopsis

```
[flags] [options] [files...]
```

```zsh
:file:_files -g '*.html'
```

# Description

Compiles web components to separate files for javascript, styles and template markup.

# Options

+ `-o, --out [dir] {=cwd}` Output directory
+ `-n, --name [val] {=components}` Name for output files
+ `-m, --html [file]` Template output file
+ `-s, --css [file]` Stylesheet output file
+ `-j, --js [file]` Javascript output file
+ `-t, --transforms [name...]` Run transform plugins
+ `-c, --rc [file...]` Configuration files to require
+ `-e, --extract [dir]` Extract shadow styles to directory
+ `-i, --inject [dir]` Inject shadow styles from directory
+ `-a, --manifest [file]` Write manifest to file
+ `-f, --force` Force overwrite existing files
+ `--print-imports` Print the file hierarchy
+ `--print-tree` Print the component tree hierarchy
+ `--print-manifest` Print the generated files manifest
+ `-h, --help` Display help and exit
+ `--version` Print the version and exit

# Files

By default files are written to the current working directory. The `--out` option can be used to write files to a different directory and the names of the files can be changed using the `--name` option. Do not specify a file extension when using the `--name` option.

The `--html`, `--css` and `--js` option allows setting specific paths for each output file type, in this case they override any paths generated using the `--out` and `--name` options and the file extension should be specified.

# Transforms

Transforms can be specified using the name or a comma-separated list of names:

```
trucks -t trim -t skate components.html
trucks -t trim,skate components.html
```

# Shadow Styles

When using third-party component you may wish to override the component styles.

Use the `--extract` option to write individual stylesheet files per component, you can then modify these stylesheets and inject them later using the `--inject` option.

```
mkdir -p src/components/css
trucks components.html -o build --extract src/components/css
```

Edit the generated stylesheets then apply the overriden styles:

```
trucks components.html -o build --inject src/components/css
```
