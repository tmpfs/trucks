## Configuration

Use the `stylus` key to configure this transform:

```javascript
const options = {
  files: ['component.html'],
  conf: {
    transforms: {
      stylus: {
        paths: [process.cwd()]
      }
    }
  }
}
```

The configuration object is passed to `stylus.render()`, see the [stylus documentation][stylus-css].
