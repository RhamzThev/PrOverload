import React, {Component} from 'react';
import {useDispatch, connect} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import {logIn, signUp} from './slices';
import store from '../store';

const Stack = createNativeStackNavigator();

class Auth extends Component {
  constructor(props) {
    super(props);

    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleLogIn(username, password, setAlert) {
    var state = {
      username,
      password,
      setAlert,
    };

    this.props.logIn(state);
  }

  handleSignUp(username, password, name, age, weight, height, setAlert) {
    var state = {
      username,
      password,
      name,
      age,
      weight,
      height,
      setAlert,
    };
    this.props.signUp(state);
  }

  render() {
    return (
      // screenOptions={{ headerShown: false }}
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Log In">
          {props => <SignIn {...props} handleLogIn={this.handleLogIn} />}
        </Stack.Screen>
        <Stack.Screen name="Sign Up">
          {() => <SignUp handleSignUp={this.handleSignUp} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  const {auth} = state;
  return {auth: auth};
}

const mapDispatchToProps = {
  logIn,
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
