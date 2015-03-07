import process from 'npm:process@0.10.1'
import hrtime from 'browser-process-hrtime'
process.hrtime = hrtime;
import CleanCSS from 'clean-css'

export default function(data) {
    return new CleanCSS({ processImport: false, debug: true }).minify(data);
}