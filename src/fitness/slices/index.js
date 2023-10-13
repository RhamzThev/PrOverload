import {NativeModules} from 'react-native';

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const {FitnessModule} = NativeModules;

// FOR TESTING
var REGIMES = [{id: 1, name: 'Pullin some bitches'}];

var WORKOUTS = [
  {id: 1, name: 'Pull A', regimeId: 1},
  {id: 2, name: 'Pull B', regimeId: 1},
];

var SETS = [
  {id: 1, workoutId: 1},
  {id: 2, workoutId: 1},
  {id: 3, workoutId: 1},
  {id: 4, workoutId: 1},
  {id: 5, workoutId: 2},
  {id: 6, workoutId: 2},
  {id: 7, workoutId: 2},
  {id: 8, workoutId: 2},
];

var EXERCISES = [
  {id: 1, indExId: 1, setId: 1, sets: 3, reps: 10},
  {id: 2, indExId: 2, setId: 1, sets: 3, reps: 12},
  {id: 3, indExId: 3, setId: 2, sets: 4, reps: 10},
  {id: 4, indExId: 4, setId: 3, sets: 3, reps: 12},
  {id: 5, indExId: 5, setId: 3, sets: 3, reps: 10},
  {id: 6, indExId: 6, setId: 4, sets: 4, reps: 10},
  {id: 7, indExId: 7, setId: 5, sets: 4, reps: 8},
  {id: 8, indExId: 8, setId: 6, sets: 3, reps: 10},
  {id: 9, indExId: 6, setId: 6, sets: 3, reps: 12},
  {id: 10, indExId: 4, setId: 7, sets: 4, reps: 10},
  {id: 11, indExId: 9, setId: 8, sets: 3, reps: 8},
  {id: 12, indExId: 3, setId: 8, sets: 3, reps: 6},
];

var INDEXERCISES = [
  {id: 1, name: 'DB Row'},
  {id: 2, name: 'Incline DB Curls'},
  {id: 3, name: 'Bent-Over Rows'},
  {id: 4, name: 'Bands'},
  {id: 5, name: 'Preacher Curls'},
  {id: 6, name: 'Rear Delt Raises'},
  {id: 7, name: 'BB Rows'},
  {id: 8, name: 'Concentration Curls'},
  {id: 9, name: 'Hammer Curls'},
];

// TESTING STATE
const testState = {
  fitness: {regimes: REGIMES},
  regime: null,
  workout: null,
  set: null,
};

export const createRegime = createAsyncThunk(
  'fitness/createRegimeStatus',
  async (action, thunkAPI) => {
    var createdRegimeId = await FitnessModule.createRegime(action);

    if (createdRegimeId != null) {
      var state = {
        regime: await FitnessModule.readWorkoutByRegimeId(createdRegimeId),
        fitness: await FitnessModule.readRegimes(),
      };

      return state;
    }
  },
);

export const createWorkout = createAsyncThunk(
  'fitness/createWorkoutStatus',
  async (action, thunkAPI) => {
    var createdWorkoutId = await FitnessModule.createWorkout(
      action.name,
      action.regimeId,
    );

    if (createdWorkoutId != null) {
      var state = {
        workout: await FitnessModule.readSetByWorkoutId(createdWorkoutId),
        regime: await FitnessModule.readWorkoutByRegimeId(action.regimeId),
      };

      return state;
    }
  },
);

export const createSet = createAsyncThunk(
  'fitness/createSetStatus',
  async (action, thunkAPI) => {
    var createdSetId = await FitnessModule.createSet(action);

    if (createdSetId != null) {
      var state = {
        set: await FitnessModule.readExerciseBySetId(createdSetId),
        workout: await FitnessModule.readSetByWorkoutId(action),
      };

      return state;
    }
  },
);

export const createExercise = createAsyncThunk(
  'fitness/createExerciseStatus',
  async (action, thunkAPI) => {
    var createdExercise = await FitnessModule.createExercise(
      action.setId,
      action.name,
      Number(action.sets),
      Number(action.reps),
    );

    if (createdExercise) {
      var state = {
        set: await FitnessModule.readExerciseBySetId(action.setId),
        workout: await FitnessModule.readSetByWorkoutId(action.workoutId),
        exercises: await FitnessModule.readIndExercises(),
      };

      return state;
    }
  },
);

export const selectExercise = createAsyncThunk(
  'fitness/selectExerciseStatus',
  async (action, thunkAPI) => {
    var selectedExercise = await FitnessModule.selectExercise(
      action.setId,
      action.indExerciseId,
      Number(action.sets),
      Number(action.reps),
    );
    if (selectedExercise) {
      var state = {
        set: await FitnessModule.readExerciseBySetId(action.setId),
        workout: await FitnessModule.readSetByWorkoutId(action.workoutId),
      };

      return state;
    }
  },
);

export const selectRegime = createAsyncThunk(
  'fitness/selectRegimeStatus',
  async (action, thunkAPI) => {
    return await FitnessModule.readWorkoutByRegimeId(action);
  },
);

export const selectWorkout = createAsyncThunk(
  'fitness/selectWorkoutStatus',
  async (action, thunkAPI) => {
    return await FitnessModule.readSetByWorkoutId(action);
  },
);

export const selectSet = createAsyncThunk(
  'fitness/selectSetStatus',
  async (action, thunkAPI) => {
    return await FitnessModule.readExerciseBySetId(action);
  },
);

export const getRegimes = createAsyncThunk(
  'fitness/getRegimesStatus',
  async (action, thunkAPI) => {
    return await FitnessModule.readRegimes();
  },
);

export const getExercises = createAsyncThunk(
  'fitness/getExercisesStatus',
  async (action, thunkAPI) => {
    return await FitnessModule.readIndExercises();
  },
);

// INITIAL STATE
const initialState = {
  fitness: [],
  regime: {},
  workout: {},
  set: {},
  exercises: [],
};

const fitnessSlice = createSlice({
  name: 'fitness',
  initialState: initialState,
  reducers: {
    clearSet(state) {
      console.log('SET CLEARED');
      state.set = {};
    },

    clearWorkout(state) {
      console.log('WORKOUT CLEARED');
      state.workout = {};
    },

    clearRegime(state) {
      console.log('REGIME CLEARED');
      state.regime = {};
    },

    clearFitness(state) {
      console.log('FITNESS CLEARED');
      state.fitness = [];
    },
  },
  extraReducers: {
    [getRegimes.fulfilled]: (state, action) => {
      console.log('REGIMES RETRIEVED');

      state.fitness = action.payload;
    },

    [getExercises.fulfilled]: (state, action) => {
      console.log('EXERCISES RETRIEVED');

      state.exercises = action.payload;
    },

    [createRegime.fulfilled]: (state, action) => {
      console.log('REGIME CREATED');

      state.fitness = action.payload.fitness;
      state.regime = action.payload.regime;
    },

    [createWorkout.fulfilled]: (state, action) => {
      console.log('WORKOUT CREATED');

      state.regime = action.payload.regime;
      state.workout = action.payload.workout;
    },

    [createSet.fulfilled]: (state, action) => {
      console.log('SET CREATED');

      state.workout = action.payload.workout;
      state.set = action.payload.set;
    },

    [createExercise.fulfilled]: (state, action) => {
      console.log('(IND)EXERCISE CREATED');

      state.workout = action.payload.workout;
      state.set = action.payload.set;
      state.exercises = action.payload.exercises;
    },

    // WIP
    [selectExercise.fulfilled]: (state, action) => {
      console.log('(IND)EXERCISE SELECTED');

      state.workout = action.payload.workout;
      state.set = action.payload.set;
    },

    [selectRegime.fulfilled]: (state, action) => {
      console.log('REGIME SELECTED');

      state.regime = action.payload;
    },

    [selectWorkout.fulfilled]: (state, action) => {
      console.log('WORKOUT SELECTED');
      state.workout = action.payload;
    },
    [selectSet.fulfilled]: (state, action) => {
      console.log('SET SELECTED');
      state.set = action.payload;
    },
  },
});

export const {clearSet, clearWorkout, clearRegime, clearFitness} =
  fitnessSlice.actions;
export default fitnessSlice.reducer;
