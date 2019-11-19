/// <reference types="highlight.js" />

declare module 'highlight.js/lib/highlight.js' {
    const hl: typeof hljs;
    export default hl;
}

declare module 'highlight.js/lib/languages/css.js' {
    const css: (hljs?: hljs.HLJSStatic) => hljs.IModeBase;
    export default css;
}