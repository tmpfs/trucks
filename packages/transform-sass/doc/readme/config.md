## Configuration

Use the `sass` key to configure this transform:

```javascript
const options = {
  files: ['component.html'],
  conf: {
    transforms: {
      sass: {
        includePaths: [process.cwd()]
      }
    }
  }
}
```

The configuration object is passed to `sass.render()`, see the [sass documentation][node-sass].
