// css includes
import './main.css'
import 'highlight.js/styles/default.css'
import 'highlight.js/styles/foundation.css'

// css as text
import mainCss from './main.css.txt'

import { h, render, Component } from 'preact';
/** @jsx h */

import { minify } from './minify'
import { WorkerOutput } from './shared-types';

interface StatsProps {
    timeSpent: number
    originalSize: number
    minifiedSize: number
    efficiency: number
}
class Stats extends Component<StatsProps> {
    render(stats: StatsProps) {
        const generatedStr = stats.timeSpent < 2 ? ' Minified instantly.' : ` Minified in ${stats.timeSpent / 1000} seconds.`;
        return <div className="stats">
            Source: {stats.originalSize} characters.
            Minified: {stats.minifiedSize} characters.
            Saved {Math.round(stats.efficiency * 10000) / 100}%.
            {generatedStr}
        </div>;
    }
}

interface WarningsProps {
    warnings: string[]
}
class Warnings extends Component<WarningsProps> {
    render(props: WarningsProps) {
        const ws = props.warnings.map(w => <div key={w} className="warning">Warning: {w}</div>);
        return props.warnings.length > 0 ? <div className="warnings">{ws}</div> : <span />;
    }
}

function constructWorker(filename: string) {
    try {
        if (typeof Worker !== 'undefined') {
            return new Worker('./build-worker.js');
        }
    } catch (e) {
        console.error(e);
    }
    return undefined;
}

interface ContainerState {
    minified: string
    highlighted: string
    warnings: string[]
    stats: StatsProps
    worker?: Worker
    id: number
}
class Container extends Component<{}, ContainerState> {
    constructor() {
        super();
        const def = 'Start typing in the other box!';
        this.state = {
            minified: def,
            highlighted: def,
            warnings: [],
            stats: { efficiency: 1, minifiedSize: 0, originalSize: 0, timeSpent: 0 },
            worker: constructWorker('./worker.js'),
            id: 0
        };
    }
    textArea?: HTMLTextAreaElement
    render(props: any, state: ContainerState) {
        var html = state.highlighted || state.minified;
        return <div>
            <textarea className="input io" ref={e => this.textArea = e || undefined} onInput={e => this.minify()} spellcheck={false} />
            <div className="output io">
                <Stats {...state.stats} />
                <Warnings warnings={state.warnings} />
                <div className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>;
    }
    componentDidMount() {
        if (this.state.worker) {
            this.state.worker.onmessage = e => {
                // only update the most recent minified result
                // this might happen if a long string is sent to ww async, and then a short string is processed synchronously
                const data = e.data as WorkerOutput;
                if (data.id != this.state.id) return;

                this.setData(data.data);
            }
        }
        if (this.textArea) {
            this.textArea.value = mainCss;
        }
        this.minify();
    }
    minify() {
        var id = this.state.id + 1;
        let text = '';
        if (this.textArea) text = this.textArea.value;
        if (!text) text = '';
        if (text.length > 5000 && this.state.worker) {
            //use ww
            this.state.worker.postMessage({ id, text });
        } else {
            var data = minify(text);
            this.setData(data);
        }
        this.setState({ id });
    }
    setData(data: ReturnType<typeof minify>) {
        this.setState({ minified: data.styles, warnings: data.warnings, stats: data.stats, highlighted: data.highlighted.value });
    }
}

const container = document.getElementById('container') as HTMLElement;
render(<Container />, container);