import React, {useState} from 'react';
import {View, Text, TextInput, Button, NativeModules} from 'react-native';
import {authStyles} from '../../../styles';

const {TestModule} = NativeModules;

export default function SignIn({handleLogIn, navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [alert, setAlert] = useState('');

  return (
    <View style={authStyles.containerView}>
      <View style={authStyles.titleView}>
        <Text style={authStyles.textLogo}>Proverload</Text>
      </View>
      <View style={authStyles.dataView}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Button
          color="black"
          onPress={() => handleLogIn(username, password, setAlert)}
          title="Log In"
        />
        <Text style={{padding: 10}}>
          No account?{' '}
          <Text
            style={{color: 'blue'}}
            onPress={() => navigation.navigate('Sign Up')}>
            Create one!
          </Text>
        </Text>
      </View>
      <View>
        <Text style={{color: 'red'}}>{alert}</Text>
      </View>
    </View>
  );
}
