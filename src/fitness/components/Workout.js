import React, {useState, useEffect} from 'react';
import {View, Text, Button, Modal, TouchableHighlight} from 'react-native';

import {fitnessStyles} from '../../../styles';

function ListedSet({element, handleChild}) {
  return (
    <TouchableHighlight
      style={fitnessStyles.featureView}
      activeOpacity={0.5}
      underlayColor="#DDDDDD"
      onPress={() => handleChild(element.id)}>
      <View>
        {element.exercises.map(exercise => {
          return (
            <View style={{margin: 5}} key={exercise.id}>
              <Text style={{color: 'black'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {exercise.name.toUpperCase()}
                </Text>{' '}
                for {exercise.sets} x {exercise.reps}
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableHighlight>
  );
}

function CreateSet({workoutId, handleCreate}) {
  const [modalVisible, setModalVisible] = useState(false);

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
            <Text
              style={{
                ...fitnessStyles.featureText,
                marginBottom: 20,
              }}>
              This will create a new set.
            </Text>
            <View style={fitnessStyles.buttonView}>
              <Button
                color="black"
                onPress={() => {
                  handleCreate(workoutId);
                  setModalVisible(false);
                }}
                title="Confirm"
              />
              <Button
                color="black"
                onPress={() => setModalVisible(false)}
                title="Cancel"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function Workout(props) {
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
              <View key={element.id}>
                <ListedSet element={element} handleChild={props.handleChild} />
              </View>
            );
          })
        : null}
      <CreateSet workoutId={props.id} handleCreate={props.handleCreate} />
    </View>
  );
}
