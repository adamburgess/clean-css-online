//maybe adding react for something this simple is an overkill

import React from 'react'
import minify from './minify'

import hljs from './highlight.js/highlight.pack'
import './highlight.js/default.css!'
import './highlight.js/foundation.css!'
var highlight = hljs.highlight;

import './main.css!'

var ww = new Worker('worker.js');

var Container = React.createClass({
    getInitialState: function() {
        return {
            minified: 'Start typing in the other box!',
            error: false,
            dv: `/*

Sunburst-like style (c) Vasily Polovnyov <vast@whiteants.net>

*/

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #000;
  color: #f8f8f8;
  -webkit-text-size-adjust: none;
}

.hljs-comment,
.hljs-javadoc {
  color: #aeaeae;
  font-style: italic;
}

.hljs-keyword,
.ruby .hljs-function .hljs-keyword,
.hljs-request,
.hljs-status,
.nginx .hljs-title {
  color: #e28964;
}`
        };
    },
    render: function() {
        var html = highlight('css', this.state.minified).value;
        return <div>
            <textarea defaultValue={this.state.dv} onChange={this.minify} />
            <div className="rendered hljs" dangerouslySetInnerHTML={{__html: html}} />
        </div>;
    },
    componentDidMount: function() {
        ww.onmessage = e => {
            console.log(e);
            this.setState({ minified: e.data.styles, error: false });
        }
        this.minify({
            target: {
                value: this.state.dv
            }
        });
    },
    minify: function(e) {
        var text = e.target.value;
        if(text.length > 25000) {
            //use ww
            ww.postMessage(text);
        } else {
            var data = minify(text)
            this.setState({ minified: data.styles, error: false });
        }
    }
})

React.render(<Container />, document.getElementById('container'));

