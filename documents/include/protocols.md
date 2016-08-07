Protocol plugins are classes mapped to URL protocols and allow the file load mechanism to be extended so that users can distribute and install web components from remote resources or implement custom protocols.

Protocols are used for the input `files` array as well as HTML imports so that the following are equivalent:

```shell
trucks npm://trucks-example-skate-component
```

```html
<link rel="import" href="npm://trucks-example-skate-component">
```

See the [file][resolver-file], [http][resolver-http] and [npm][resolver-npm] plugins for example implementations.

### Default Protocol

By default a protocol handler for the `file:` scheme is registered by the [load][] plugin so HTML imports can be loaded from the local file system.

Note that the command line interface adds support for the [http][resolver-http] and [npm][resolver-npm] protocols.

### Using Protocol Plugins

To enable a protocol first install the package (`npm i trucks-resolver-http --save-dev`) and then enable the plugin in the `protocols` list:

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

Plugin functions are invoked synchronously before the [load][] plugin executes; they allow HTML imports to be mapped to different protocols.

### Writing Protocol Plugins

Protocol plugins follow the standard plugin function signature `function(state, conf)` however unlike other plugins they are invoked synchronously and passed a reference to the protocol registry.

The plugin function should return a closure that registers protocol classes:

```javascript
function plugin(state, conf) {
  return (registry) => {
    registry.register(PROTOCOL_STRING, PROTOCOL_CLASS);
  }
}
```

Protocol classes must be a subclass of the [core resolver][resolver-core]. 

### Example Protocol

The structure for a hypothetical FTP protocol plugin:

```javascript
const Protocol = require('trucks-resolver-core');

class FtpProtocol extends Protocol {
  /* plugin implementation */
}

function ftp(state, conf) {
  return (registry) => {
    registry.register('ftp:', FtpProtocol);
    registry.register('sftp:', FtpProtocol);
  }
}
```
