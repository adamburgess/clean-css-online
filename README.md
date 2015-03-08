clean-css online
---------------

Built using [clean-css](https://github.com/jakubpawlowicz/clean-css) and [jspm](http://jspm.io/) package manager.
Uses webworkers for files over 50kb.

To test locally:

````
npm install -g jspm
jspm install
jspm bundle-sfx lib/worker build-worker.js
````
and then use your favorite local http server (e.g. npm:live-server) to serve index-dev.html

due to the web worker API being finicky, you'll have to re-build the worker bundle to test with the worker.

or, if you want to compile everything to load fast:
````
npm install -g jspm
jspm install
jspm bundle-sfx lib/main.jsx! build.js
jspm bundle-sfx lib/worker build-worker.js
````
and then load up index.html.

