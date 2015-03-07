import minify from './minify'

onmessage = function(e) {
    var data = minify(e.data);
    postMessage(data);
}