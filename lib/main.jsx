import React from 'react'
import minify from './minify'

import hljs from './highlight.js/highlight.pack'
import './highlight.js/default.css!'
import './highlight.js/foundation.css!'
var highlight = hljs.highlight;

import './main.css!'
import mainCss from './main.css!text'

var ww = new Worker('worker.js');

var Container = React.createClass({
    getInitialState: function() {
        return {
            minified: 'Start typing in the other box!',
            warnings: [],
            stats: {}
        };
    },
    render: function() {
        var html = highlight('css', this.state.minified).value;
        var stats = this.state.stats;
        var generatedStr = stats.timeSpent < 2 ? ' Generated instantly.' : ` Generated in ${stats.timeSpent / 1000} seconds.`;
        return <div>
            <textarea className="input io" defaultValue={mainCss} onChange={this.minify} />
            <div className="output io">
              <div className="hljs" dangerouslySetInnerHTML={{__html: html}} />
              <div className="stats">
                Source: {stats.originalSize} characters.
                Minified: {stats.minifiedSize} characters.
                Saved {Math.round(stats.efficiency * 10000) / 100}%.
                {generatedStr}
              </div>
            </div>
        </div>;
    },
    componentDidMount: function() {
        ww.onmessage = e => {
            var data = e.data;
            this.setState({ minified: data.styles, warnings: data.warnings, stats: data.stats });
        }
        this.minify({
            target: {
                value: mainCss
            }
        });
    },
    minify: function(e) {
        var text = e.target.value;
        if(text.length > 50000) {
            //use ww
            ww.postMessage(text);
        } else {
            var data = minify(text);
            console.log(data);
            this.setState({ minified: data.styles, warnings: data.warnings, stats: data.stats });
        }
    }
})

React.render(<Container />, document.getElementById('container'));