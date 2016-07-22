## Resolvers

Resolvers are plugins that are invoked synchronously before the [load][] plugin executes; they allow HTML imports to be mapped to different protocols.

By default a protocol handler for `file:` scheme is registered by the [load][] plugin so HTML imports can be loaded from the local file system.

Resolver plugins allow users to distribute and install web components from remote resources or implement custom protocols.

To enable a resolver first install the resolver (`npm i trucks-resolver-http --save-dev`) and then enable the plugin in the `protocols` list:

```javascript
const options = {
  files: ['components.html'],
  protocols: ['http']
}
```

You can now use HTTP and HTTPS imports:

```html
<link rel="import" href="https://domain.com/components.html">
```

The signature for resolver plugins is:

```javascript
function ftp(state, conf) {
  return (registry) => {
    registry.register('ftp:', FtpResolver); 
  }
}
```

Plugins must register a subclass of the [core resolver][resolver-core].

See the [file resolver][resolver-file] and [http resolver][resolver-http] for example classes and plugin functions.
