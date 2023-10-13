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

function FeaturedRegime({element, navigation, route, params}) {
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

function ListedRegime({element, handleChild}) {
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
        <Text>This is an example description for a regime.</Text>
      </View>
    </TouchableHighlight>
  );
}

function CreateRegime({handleCreate}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');

  const [alert, setAlert] = useState('');

  function reset() {
    setModalVisible(false);
    setName('');
  }

  return (
    <View>
      <Button color="black" onPress={() => setModalVisible(true)} title="+" />
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View
          style={{
            ...fitnessStyles.containerView,
            ...fitnessStyles.dimView,
          }}>
          <View style={fitnessStyles.modalView}>
            <Text style={fitnessStyles.featureText}>CREATE REGIME</Text>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <View style={fitnessStyles.buttonView}>
              <Button
                color="black"
                onPress={() => {
                  handleCreate(name, reset, setAlert);
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

export default function Main(props) {
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
              <ListedRegime
                key={element.id}
                element={element}
                handleChild={props.handleChild}
              />
            );
          })
        : null}
      <CreateRegime handleCreate={props.handleCreate} />
    </View>
  );
}
