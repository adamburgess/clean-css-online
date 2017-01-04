clean-css online
---------------

Built using [clean-css](https://github.com/jakubpawlowicz/clean-css) and [webpack](https://webpack.github.io/) module bundler.
[Preact](https://preactjs.com/) for rendering and [highlight.js](https://highlightjs.org/) for highlighting the minified css.
Uses [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) for files over 5kb.

To test locally:

````
npm install
webpack
````
and then use your favorite local http server (e.g. `npm:live-server`) to serve `index.html`.
