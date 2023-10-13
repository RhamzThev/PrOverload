/* eslint-disable react/no-unstable-nested-components */
import React, {Component} from 'react';

import {View, Text, Button, Image} from 'react-native';

import {connect} from 'react-redux';

import {mainStyles} from '../../styles';

import {signOut} from '../auth/slices';
import {getRegimes, getExercises} from '../fitness/slices';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './components/Home';
import Fitness from '../fitness';

import store from '../store';

const Tab = createBottomTabNavigator();

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleFitness = this.handleFitness.bind(this);
  }

  handleSignOut() {
    const {dispatch} = this.props;
    let action = signOut();
    dispatch(action);
  }

  handleFitness(navigation) {
    navigation.navigate('Fitness Page');
  }

  componentDidMount() {
    this.props.getRegimes();
    this.props.getExercises();
  }

  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused}) => {
            let icon;

            switch (route.name) {
              case 'Home Page':
                icon = focused
                  ? require('../../img/iconSelect.png')
                  : require('../../img/icon.png');
                break;
              case 'Fitness Page':
                icon = focused
                  ? require('../../img/fitnessSelect.png')
                  : require('../../img/fitness.png');
                break;
            }

            return <Image style={mainStyles.tabImage} source={icon} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home Page">
          {props => (
            <Home
              {...props}
              name={store.getState().auth.name}
              handleFitness={this.handleFitness}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Fitness Page">
          {props => <Fitness {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
}

const mapDispatchToProps = {
  signOut,
  getRegimes,
  getExercises,
};

export default connect(null, mapDispatchToProps)(Main);
