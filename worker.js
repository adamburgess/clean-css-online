importScripts('jspm_packages/babel-polyfill.js')
//this is a hack.
window = { XMLHttpRequest: {} }
importScripts('bin/build-worker.js')