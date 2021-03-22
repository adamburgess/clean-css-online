import hrtime from 'browser-process-hrtime'

import CleanCSS from 'clean-css'

import 'highlight.js'
import hljs from 'highlight.js/lib/core.js'
import hljsCss from 'highlight.js/lib/languages/css.js'
hljs.registerLanguage('css', hljsCss);

// hack
if(typeof process === 'undefined') window.process = {} as unknown as NodeJS.Process;
process.hrtime = hrtime as NodeJS.HRTime;

const cleanCss = new CleanCSS({
    inline: false, // don't inline @imports
    rebase: false, // don't modify urls
    level: 2, // enable all optimisations
});

export function minify(data: string) {
    let minified = cleanCss.minify(data) as CleanCSS.Output & { highlighted: HighlightResult };
    minified.highlighted = hljs.highlight('css', minified.styles);
    return minified;
}
