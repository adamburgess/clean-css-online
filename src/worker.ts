import { minify } from './minify'
import { WorkerInput } from './shared-types';

onmessage = function (e) {
    const input = <WorkerInput>e.data;
    const id = input.id;
    const text = input.text;
    const data = minify(text);
    postMessage({ id, data }, '*');
}
