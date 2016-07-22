## Resolvers

Resolvers are plugins that are invoked synchronously before the [load][] plugin executes; they allow HTML imports to be mapped to different protocols.

By default a protocol handler for `file:` schemes is registered by the [load][] plugin so HTML imports can be loaded from the local file system.

Resolver plugins allow users to distribute and install web components from remote resources or implement custom protocols.

The signature for resolver plugins is:

```
function ftp(state, conf) {
  return (registry) => {
    registry.register('ftp:', FtpResolver); 
  }
}
```

Plugins must register a subclass of the [core resolver][resolver-core].

See the [file resolver][resolver-file] and [http resolver][resolver-http] for example classes and plugin functions.
