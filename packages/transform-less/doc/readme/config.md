## Configuration

Use the `less` key to configure this transform:

```javascript
const options = {
  files: ['component.html'],
  conf: {
    transforms: {
      less: {
        paths: [process.cwd()]
      }
    }
  }
}
```

The configuration object is passed to `less.render()`, see the [less documentation][less-css].
