import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser';
import virtual from 'rollup-plugin-virtual';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import cssnano from 'cssnano';
import fs from 'fs';

function html({ input, output, tags }) {
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
                if (file.endsWith('.js')) {
                    js.push(file);
                } else if (file.endsWith('.css')) {
                    css.push(file);
                }
            }
            asset.source = asset.source.replace('$css', css.map(c => `<link rel="stylesheet" href="${c}">`).join(''));
            asset.source = asset.source.replace('$js', js.map(c => `<script ${tags} src="${c}"></script>`).join(''));

            this.emitFile(asset);
        }
    }
}

let inputs = ['src/main.tsx', 'src/worker.ts'];
export default inputs.map(input => {
    let main = input == 'src/main.tsx';
    return {
        input: input,
        output: {
            format: 'iife',
            dir: 'dist',
            entryFileNames: main ? 'build.js' : 'worker.js',
            sourcemap: true,
            
        },

        plugins: [
            nodeResolve({
                preferBuiltins: true
            }),
            commonjs({
                include: 'node_modules/**',
            }),
            virtual({
                'src/main.css.txt': `export default \`${fs.readFileSync('src/main.css', 'utf8')}\`;`,
            }),
            globals(),
            builtins(),
            typescript(),
            terser(),
            postcss({
                extract: true,
                sourceMap: true,
                plugins: [
                    cssnano()
                ]
            }),
            main ? html({
                input: 'src/index.html',
                output: 'index.html',
                tags: 'defer'
            }) : undefined
        ]
    };
});
