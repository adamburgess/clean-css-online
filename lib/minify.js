import hrtime from 'browser-process-hrtime'

import CleanCSS from 'clean-css'

import hljs from 'highlight.js/lib/highlight.js'
import hljsCss from 'highlight.js/lib/languages/css.js'
hljs.registerLanguage('css', hljsCss);

// hack
if(!process) process = {};
process.hrtime = hrtime;

var cleanCss = new CleanCSS({
    inline: false, // don't inline @imports
    rebase: false, // don't modify urls
    level: 2, // enable all optimisations
});

export default function(data) {
    var minified = cleanCss.minify(data);
    minified.highlighted = hljs.highlight('css', minified.styles);
    return minified;
}