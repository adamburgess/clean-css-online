//these are more hacks.
import process from 'process'
import hrtime from 'browser-process-hrtime'
process.hrtime = hrtime;

import CleanCSS from 'clean-css'

export default function(data) {
    return new CleanCSS({ processImport: false, debug: true }).minify(data);
}