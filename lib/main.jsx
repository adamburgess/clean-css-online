//maybe adding react for something this simple is an overkill

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
            error: false
        };
    },
    render: function() {
        var html = highlight('css', this.state.minified).value;
        return <div>
            <textarea className="input" defaultValue={mainCss} onChange={this.minify} />
            <div className="output hljs" dangerouslySetInnerHTML={{__html: html}} />
        </div>;
    },
    componentDidMount: function() {
        ww.onmessage = e => {
            console.log(e);
            this.setState({ minified: e.data.styles, error: false });
        }
        this.minify({
            target: {
                value: mainCss
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

