import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Main from './components/Main';
import Regime from './components/Regime';
import Workout from './components/Workout';
import Set from './components/Set';

import {
  createRegime,
  createWorkout,
  createSet,
  createExercise,
  selectExercise,
  selectRegime,
  selectWorkout,
  selectSet,
  clearSet,
  clearWorkout,
  clearRegime,
  clearFitness,
} from '../fitness/slices';

import store from '../store';

const Stack = createNativeStackNavigator();

class Fitness extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regimeName: '',
      workoutName: '',
    };

    this.handleCreateRegime = this.handleCreateRegime.bind(this);
    this.handleCreateWorkout = this.handleCreateWorkout.bind(this);
    this.handleCreateSet = this.handleCreateSet.bind(this);

    this.handleCreateExercise = this.handleCreateExercise.bind(this);
    this.handleSelectExercise = this.handleSelectExercise.bind(this);

    this.handleSelectRegime = this.handleSelectRegime.bind(this);
    this.handleSelectWorkout = this.handleSelectWorkout.bind(this);
    this.handleSelectSet = this.handleSelectSet.bind(this);
  }

  async handleCreateRegime(name, reset, setAlert) {
    if (name) {
      await this.props.createRegime(name);
      this.setState({
        regimeName: name.toUpperCase(),
      });
      this.props.navigation.navigate('Fitness Page', {screen: 'Regime'});
      reset();
    } else {
      setAlert('"Name" is empty. Please fill field.');
    }
  }

  async handleCreateWorkout(name, regimeId, reset, setAlert) {
    if (name) {
      var state = {
        name: name,
        regimeId: regimeId,
      };

      await this.props.createWorkout(state);
      this.setState({
        workoutName: name.toUpperCase(),
      });
      this.props.navigation.navigate('Fitness Page', {screen: 'Workout'});
      reset();
    } else {
      setAlert('"Name" is empty. Please fill field.');
    }
  }

  async handleCreateSet(workoutId) {
    await this.props.createSet(workoutId);
    this.props.navigation.navigate('Fitness Page', {screen: 'Set'});
  }

  async handleCreateExercise(
    setId,
    name,
    sets,
    reps,
    workoutId,
    reset,
    setAlert,
  ) {
    if (name && sets && reps) {
      if (!isNaN(sets) && !isNaN(reps)) {
        var state = {setId, name, sets, reps, workoutId};

        await this.props.createExercise(state);
        reset();
      } else {
        setAlert(
          '"sets" and/or "reps" are not numbers. Please make "sets" and "reps" numbers.',
        );
      }
    } else {
      setAlert('One or more fields are empty. Please fill all fields.');
    }
  }

  async handleSelectExercise(
    setId,
    indExerciseId,
    sets,
    reps,
    workoutId,
    reset,
    setAlert,
  ) {
    var state = {setId, indExerciseId, sets, reps, workoutId};

    await this.props.selectExercise(state);
  }

  async handleSelectRegime(id, name) {
    await this.props.selectRegime(id);
    this.setState({
      regimeName: name.toUpperCase(),
    });
    this.props.navigation.navigate('Fitness Page', {screen: 'Regime'});
  }

  async handleSelectWorkout(id, name) {
    await this.props.selectWorkout(id);
    this.setState({
      workoutName: name.toUpperCase(),
    });
    this.props.navigation.navigate('Fitness Page', {screen: 'Workout'});
  }

  async handleSelectSet(id) {
    await this.props.selectSet(id);
    this.props.navigation.navigate('Fitness Page', {screen: 'Set'});
  }

  render() {
    return (
      <Stack.Navigator initialRouteName="Fitness">
        <Stack.Screen name="Fitness">
          {props => (
            <Main
              {...props}
              elements={store.getState().fitness.fitness}
              handleChild={this.handleSelectRegime}
              handleCreate={this.handleCreateRegime}
              handleClear={this.props.clearFitness}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Regime" options={{title: this.state.regimeName}}>
          {props => (
            <Regime
              {...props}
              id={store.getState().fitness.regime.id}
              elements={store.getState().fitness.regime.workouts}
              handleChild={this.handleSelectWorkout}
              handleCreate={this.handleCreateWorkout}
              handleClear={this.props.clearRegime}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Workout" options={{title: this.state.workoutName}}>
          {props => (
            <Workout
              {...props}
              id={store.getState().fitness.workout.id}
              elements={store.getState().fitness.workout.sets}
              handleChild={this.handleSelectSet}
              handleCreate={this.handleCreateSet}
              handleClear={this.props.clearWorkout}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Set">
          {props => (
            <Set
              {...props}
              id={store.getState().fitness.set.id}
              elements={store.getState().fitness.set.exercises}
              exercises={store.getState().fitness.exercises}
              workoutId={store.getState().fitness.workout.id}
              handleCreate={this.handleCreateExercise}
              handleSelect={this.handleSelectExercise}
              handleClear={this.props.clearSet}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  const {fitness} = state;
  return {fitness: fitness};
}

const mapDispatchToProps = {
  createRegime,
  createWorkout,
  createSet,
  createExercise,
  selectExercise,
  selectRegime,
  selectWorkout,
  selectSet,
  clearSet,
  clearWorkout,
  clearRegime,
  clearFitness,
};

export default connect(mapStateToProps, mapDispatchToProps)(Fitness);
