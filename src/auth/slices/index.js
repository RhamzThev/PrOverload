import {NativeModules} from 'react-native';

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const {AuthModule} = NativeModules;

async function getUserInfo(username) {
  return {
    username: username,
    name: await AuthModule.name(username),
    age: await AuthModule.age(username),
    weight: await AuthModule.weight(username),
    height: await AuthModule.height(username),
    token: username + "'s token",
  };
}

export const logIn = createAsyncThunk(
  'auth/logInStatus',
  async (action, thunkAPI) => {
    var loggingIn = await AuthModule.logIn(action.username, action.password);

    if (loggingIn.status) {
      return loggingIn.info;
    } else {
      action.setAlert(loggingIn.info);
      return null;
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signUpStatus',
  async (action, thunkAPI) => {
    var signingUp = await AuthModule.signUp(
      action.username,
      action.password,
      action.name,
      Number(action.age),
      Number(action.weight),
      Number(action.height),
    );

    console.log(signingUp.status);

    if (signingUp.status) {
      return signingUp.info;
    } else {
      action.setAlert(signingUp.info);
      return null;
    }
  },
);

// INITIAL STATE
const initialState = {
  username: null,
  name: null,
  age: null,
  weight: null,
  height: null,
  token: null,
};

const testState = {
  username: 'rozfom',
  name: 'Rhamsez',
  age: 19,
  weight: 225,
  height: 70,
  token: "Rhamsez's token",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      state.token = null;
    },
  },
  extraReducers: {
    [logIn.fulfilled]: (state, action) => {
      if (action.payload) {
        state.username = action.payload.username;
        state.name = action.payload.name;
        state.age = action.payload.age;
        state.weight = action.payload.weight;
        state.height = action.payload.height;
        state.token = action.payload.token;
      }
    },

    [signUp.fulfilled]: (state, action) => {
      if (action.payload) {
        state.username = action.payload.username;
        state.name = action.payload.name;
        state.age = action.payload.age;
        state.weight = action.payload.weight;
        state.height = action.payload.height;
        state.token = action.payload.token;
      }
    },
  },
});

export const {signOut} = authSlice.actions;
export default authSlice.reducer;
