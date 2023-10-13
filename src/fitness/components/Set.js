import React, {useState, useEffect} from 'react';
import {View, Text, Modal, Button, TextInput} from 'react-native';

import {fitnessStyles} from '../../../styles';

import SelectDropdown from 'react-native-select-dropdown';

const examples = ['1', '2', '3'];

function ListedExercise({element}) {
  return (
    <View style={{margin: 5}} key={element.id}>
      <Text style={{color: 'black'}}>
        <Text style={{fontWeight: 'bold'}}>{element.name.toUpperCase()}</Text>{' '}
        for {element.sets} x {element.reps}
      </Text>
    </View>
  );
}

function CreateExercise({exercise, setExercise}) {
  return (
    // change handleExercise to createExercise
    // show textinput for exercise
    <TextInput
      style={{textAlign: 'center'}}
      placeholder="Exercise Name"
      value={exercise}
      onChangeText={setExercise}
    />
  );
}

function SelectExercise({exercises, setExercise}) {
  return (
    // change handleExercise to selectExercise
    // show dropdown for exisitng exercises
    <View
      style={{
        alignItems: 'center',
        margin: 5,
      }}>
      <SelectDropdown
        data={exercises}
        onSelect={(selectedItem, index) => {
          setExercise(selectedItem.id);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem.name;
        }}
        rowTextForSelection={(item, index) => {
          return item.name;
        }}
      />
    </View>
  );
}

function AddExercise({
  exercises,
  setId,
  handleCreate,
  handleSelect,
  workoutId,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [handleExercise, setHandleExercise] = useState(() => handleCreate);

  const [exercise, setExercise] = useState('');
  const [sumn, setSumn] = useState(true);

  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const [alert, setAlert] = useState('');

  function reset() {
    setModalVisible(false);
    setExercise('');
    setSets('');
    setReps('');
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
            <Text
              style={{
                ...fitnessStyles.featureText,
                textAlign: 'center',
                marginBottom: 10,
              }}>
              ADD EXERCISE
            </Text>
            <View style={fitnessStyles.buttonView}>
              <Button
                color="black"
                title="Create"
                onPress={() => {
                  setHandleExercise(() => handleCreate);
                  setExercise('');
                  setSumn(true);
                }}
              />
              <Button
                color="black"
                title="Select"
                onPress={() => {
                  setHandleExercise(() => handleSelect);
                  setExercise('');
                  setSumn(false);
                }}
              />
            </View>
            {sumn ? (
              <CreateExercise exercise={exercise} setExercise={setExercise} />
            ) : (
              <SelectExercise exercises={exercises} setExercise={setExercise} />
            )}

            {/* Sets x Reps */}
            <View
              style={{...fitnessStyles.buttonView, justifyContent: 'center'}}>
              <TextInput
                style={{
                  textAlign: 'right',
                }}
                placeholder="Sets"
                value={sets}
                onChangeText={setSets}
              />
              <Text>x</Text>
              <TextInput
                style={{
                  textAlign: 'left',
                }}
                placeholder="Reps"
                value={reps}
                onChangeText={setReps}
              />
            </View>
            {/* Confirm */}

            <View style={fitnessStyles.buttonView}>
              <Button
                color="black"
                title="Confirm"
                onPress={() => {
                  handleExercise(
                    setId,
                    exercise,
                    sets,
                    reps,
                    workoutId,
                    reset,
                    setAlert,
                  );
                }}
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

export default function Set(props) {
  // console.log(props)

  useEffect(() =>
    props.navigation.addListener('beforeRemove', e => {
      props.handleClear();
    }),
  );

  return (
    <View style={fitnessStyles.containerView}>
      {props.elements !== null
        ? props.elements.map(element => {
            return <ListedExercise key={element.id} element={element} />;
          })
        : null}
      <AddExercise
        exercises={props.exercises}
        setId={props.id}
        handleCreate={props.handleCreate}
        handleSelect={props.handleSelect}
        workoutId={props.workoutId}
      />
    </View>
  );
}

// function AddExercise({setId, handleCreate, handleSelect}) {
