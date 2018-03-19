# detachable-jss-loader

This loader tries to make it easier to use manageable JSS. Here's an example:

```javascript
// example.css.js:

export default { titanic: { float: 'none' } };

// component.js:

import style from './example.css.js';

export function mountComponent() {
  style.manage();
  // ...
}

export function unmountComponent() {
  style.unmanage();
  // ...
}
```

In a React application `manage/unmanage` would be usually called in hooks such as
`componentWillMount` and `componentWillUnmount`.

In order to specify your own JSS setup (recommended), you should provide a custom source to
the jss setup:

```javascript
module.exports = {
  module: {
    rules: {
      { test: /\.css\.js$/, use: [
        { loader: 'detachable-jss-loader', options: { jssModule: './jss-setup.js' } },
      ]}
    }
  }
}
```
