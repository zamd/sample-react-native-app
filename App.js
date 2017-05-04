import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';

import Root from './components/root';

export default class App extends React.Component {
  render() {
    return (<Root/>);
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
