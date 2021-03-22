import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser';
import virtual from 'rollup-plugin-virtual';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import cssnano from 'cssnano';
import esbuild from 'rollup-plugin-esbuild';
import fs from 'fs';

function html({ input, output }) {
    const template = fs.readFileSync(input, 'utf8');
    return {
        name: 'html',
        generateBundle(options, bundle, isWrite) {
            // generate html
            let asset = {
                type: 'asset',
                fileName: output,
                source: template
            };
            let js = [];
            let css = [];
            for (let file in bundle) {
                if (file.endsWith('.mjs')) {
                    js.push(file);
                } else if (file.endsWith('.css')) {
                    css.push(file);
                }
            }
            asset.source = asset.source.replace('$css', css.map(c => `<link rel="stylesheet" href="${c}">`).join(''));
            asset.source = asset.source.replace('$js', js.map(c => c.includes('worker') ? 
                `<link href="${c}" type="modulepreload">` :
                `<script type="module" src="${c}"></script>`).join(''));

            this.emitFile(asset);
        }
    }
}

export default {

    input: ['src/main.tsx', 'src/worker.ts'],
    output: {
        format: 'esm',
        dir: 'dist',
        entryFileNames: '[name].[hash].mjs',
        sourcemap: true,
    },
    plugins: [
        nodeResolve({
            preferBuiltins: true
        }),
        commonjs(),
        virtual({
            'src/main.css.txt': `export default \`${fs.readFileSync('src/main.css', 'utf8')}\`;`,
        }),
        globals(),
        builtins(),
        esbuild({
            sourceMap: true
        }),
        terser(),
        postcss({
            extract: true,
            sourceMap: true,
            plugins: [
                cssnano()
            ]
        }),
        html({
            input: 'src/index.html',
            output: 'index.html'
        })
    ]

}
