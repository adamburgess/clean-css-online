//maybe adding react for something this simple is an overkill

import React from 'react'
import minify from './minify'

var ww = new Worker('/worker.js');
window.ww = ww;
var Container = React.createClass({
    getInitialState: function() {
        return {
            minified: 'Start typing in the other box!',
            error: false
        };
    },
    render: function() {
        return <div>
            <textarea onChange={this.minify} />
            <textarea readOnly={true} value={this.state.error ? 'Error' : this.state.minified} />
        </div>;
    },
    componentDidMount: function() {
        ww.onmessage = e => {
            console.log(e);
            this.setState({ minified: e.data.styles, error: false });
        }
    },
    minify: function(e) {
        var text = e.target.value;
        if(text.length > 5000) {
            //use ww
            ww.postMessage(text);
        } else {
            var data = minify(text)
            this.setState({ minified: data.styles, error: false });
        }
    }
})

React.render(<Container />, document.getElementById('container'));

