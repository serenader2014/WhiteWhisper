import React         from 'react';
import { Component } from 'react';
import { render }    from 'react-dom';


const user = {
    name: 'serenader'
};

class HelloWorld extends Component {
    constructor (props) {
        super(props);
        this.state = {
            input: ''
        };
    }
    handleChange (e) {
        this.setState({input: e.target.value});
    }
    render () {
        return (
            <div>
                Hello world, {this.props.user.name}
                <input 
                    type = "text" 
                    value = {this.state.input}
                    onChange = {this.handleChange.bind(this)}
                 />
                 <span>{this.state.input}</span>
            </div>
        );
    }
}

HelloWorld.propTypes = {
    user: React.PropTypes.object, 
    'user.name': React.PropTypes.string 
};

render(<HelloWorld user={user} />, document.getElementsByClassName('container')[0]);