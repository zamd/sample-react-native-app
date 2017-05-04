import React, {Component} from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Footer,
    Icon,
    Text
} from 'native-base';

import Dashboard from './dashboard';
import Login from './login'
import {cloneDeep} from 'lodash';

class Root extends Component {
    constructor() {
        super();
        this.state = {
          }
    }

    updateState = delta => {
        this.setState(Object.assign(this.state, delta));
        console.log(this.state);
    }

    render() {
        return this.state.access_token
            ? <Dashboard
                    access_token={this.state.access_token}
                    id_token={this.state.id_token}
                    updateState={this.onUpdateState}/>
            : <Login onComplete={this.onLoginComplete}/>
    }
    onUpdateState = (stateDelta) => {
        console.log(stateDelta);
    }
    onLoginComplete = (tokens) => {
        console.log(tokens);
        this.updateState(tokens);
    }

    onLoggedOut = () => {
        this.updateState("home", {});
    }
}

export default Root;