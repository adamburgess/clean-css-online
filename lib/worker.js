import minify from './minify.js'

onmessage = function(e) {
    var id = e.data.id;
    var text = e.data.text;
    var data = minify(text);
    postMessage({id, data});
}