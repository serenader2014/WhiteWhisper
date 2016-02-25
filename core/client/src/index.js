// import React         from 'react';
// import { Component } from 'react';
// import { render }    from 'react-dom';


// const user = {
//     name: 'hello world'
// };

// class HelloWorld extends Component {
//     constructor (props) {
//         super(props);
//     }
//     render () {
//         return (
//             <div>Hello world, {this.props.name}</div>
//         );
//     }
// }

// HelloWorld.propTypes = { name: React.PropTypes.string };

// render(<HelloWorld user={user} />, document.getElementsByClassName('container')[0]);



var React = require('react');
var ReactDOM = require('react-dom');

var HelloWorld = React.createClass({
    propTypes: {
        name: React.PropTypes.string
    },
    render: function () {
        return (
            <div>Hello world, {this.props.name}</div>
        );
    }
});

ReactDOM.render(<HelloWorld name="name" />, document.getElementsByClassName('container')[0]);