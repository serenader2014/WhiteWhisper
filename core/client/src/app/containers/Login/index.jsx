import React, { Component } from 'react';

import './style.scss';

export default class Login extends Component {
    constructor(...args) {
        super(args);
        this.state = {
            email   : '',
            password: '',
        };
    }

    login = () => {
        console.log(this);
    }

    render() {
        return (
            <section className="login-container">
                <input type="text" value={this.state.email} name="email" />
                <input type="password" value={this.state.password} name="password" />
                <button onClick={this.login}></button>
            </section>
        );
    }
}
