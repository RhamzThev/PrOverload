import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {authStyles} from '../../../styles';

export default function SignUp(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);

  const [alert, setAlert] = useState('');

  return (
    <View style={authStyles.containerView}>
      <View style={authStyles.titleView}>
        <Text style={authStyles.textLogo}>Sign Up</Text>
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
        <TextInput placeholder="Name" value={name} onChangeText={setName} />
        <TextInput placeholder="Age" value={age} onChangeText={setAge} />
        <TextInput
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          placeholder="Height"
          value={height}
          onChangeText={setHeight}
        />
        <Button
          color="black"
          onPress={() =>
            props.handleSignUp(
              username,
              password,
              name,
              age,
              weight,
              height,
              setAlert,
            )
          }
          title="Sign Up"
        />
      </View>
      <View>
        <Text style={{color: 'red'}}>{alert}</Text>
      </View>
    </View>
  );
}
