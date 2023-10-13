import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import {fitnessStyles} from '../../../styles';

function FeaturedWorkout({element, navigation, route, params}) {
  return (
    <View>
      <Text>{element.name}</Text>
      <Button
        onPress={() => navigation.navigate(route, params)}
        title="SELECT"
      />
    </View>
  );
}

function ListedWorkout({element, handleChild}) {
  return (
    <TouchableHighlight
      style={fitnessStyles.featureView}
      activeOpacity={0.5}
      underlayColor="#DDDDDD"
      onPress={() => handleChild(element.id, element.name)}>
      <View>
        <Text style={fitnessStyles.featureText}>
          {element.name.toUpperCase()}
        </Text>
        <Text>This is an example description for a workout.</Text>
      </View>
    </TouchableHighlight>
  );
}

function CreateWorkout({regimeId, handleCreate}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');

  const [alert, setAlert] = useState('');

  function reset() {
    setModalVisible(false);
    setName('');
  }

  return (
    <View>
      <Button
        style={fitnessStyles.createButton}
        color="black"
        onPress={() => setModalVisible(true)}
        title="+"
      />
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View
          style={{
            ...fitnessStyles.containerView,
            ...fitnessStyles.dimView,
          }}>
          <View style={fitnessStyles.modalView}>
            <Text style={fitnessStyles.featureText}>CREATE WORKOUT</Text>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <View style={fitnessStyles.buttonView}>
              <Button
                color="black"
                onPress={() => {
                  handleCreate(name, regimeId, reset, setAlert);
                }}
                title="Create"
              />
              <Button
                color="black"
                onPress={() => {
                  reset();
                }}
                title="Cancel"
              />
            </View>
            <View>
              <Text style={{color: 'red'}}>{alert}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function Regime(props) {
  useEffect(() =>
    props.navigation.addListener('beforeRemove', e => {
      props.handleClear();
    }),
  );

  return (
    <View style={fitnessStyles.containerView}>
      {props.elements !== null
        ? props.elements.map(element => {
            return (
              <ListedWorkout
                key={element.id}
                element={element}
                handleChild={props.handleChild}
              />
            );
          })
        : null}
      <CreateWorkout regimeId={props.id} handleCreate={props.handleCreate} />
    </View>
  );
}
