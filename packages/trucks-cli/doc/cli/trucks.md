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
+ `-m, --html [file]` Template output file (--extract only)
+ `-s, --css [file]` Stylesheet output file
+ `-j, --js [file]` Javascript output file
+ `-c, --rc [file...]` Configuration files to require
+ `-e, --extract` Extract templates
+ `-h, --help` Display help and exit
+ `--version` Print the version and exit

# Files

By default files are written to the current working directory. The `--out` option can be used to write files to a different directory and the names of the files can be changed using the `--name` option. Do not specify a file extension when using the `--name` option.

The `--html`, `--css` and `--js` option allows setting specific paths for each output file type, in this case they override any paths generated using the `--out` and `--name` options and the file extension should be specified.

# Templates

Template markup is only generated when the `--extract` option is given therefore the `--html` option will have no effect unless `--extract` is specified.

Use the `--extract` option when building components for the polymer framework, in this case the compiler is not invoked and the generated javascript is verbatim.
