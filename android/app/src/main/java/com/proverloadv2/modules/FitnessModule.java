package com.proverloadv2.modules;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.proverloadv2.models.fitness.Exercise;
import com.proverloadv2.models.fitness.IndExercise;
import com.proverloadv2.models.fitness.Regime;
import com.proverloadv2.models.fitness.Set;
import com.proverloadv2.models.fitness.Workout;

import org.bson.types.ObjectId;

import javax.annotation.Nullable;

import io.realm.Realm;
import io.realm.RealmQuery;

public class FitnessModule extends ReactContextBaseJavaModule {

    public FitnessModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "FitnessModule";
    }

    //HELPER FUNCTIONS
    private WritableNativeMap toRegimeMap(Regime regime){
        WritableNativeMap regimeMap = new WritableNativeMap();

        regimeMap.putString("id", regime.getId().toHexString());
        regimeMap.putString("name", regime.getName());
        regimeMap.putString("description", regime.getDescription());

        return regimeMap;
    }

    private WritableNativeMap toWorkoutMap(Workout workout){
        WritableNativeMap workoutMap = new WritableNativeMap();

        workoutMap.putString("id", workout.getId().toHexString());
        workoutMap.putString("name", workout.getName());
        workoutMap.putString("regimeId", workout.getRegimeId().toHexString());

        return workoutMap;
    }

    private String getIndExerciseName(ObjectId indExerciseId) {
        Realm realm = Realm.getDefaultInstance();

        return realm.where(IndExercise.class)
                .equalTo("id", indExerciseId)
                .findFirst().getName();

    }

    private WritableNativeMap toIndExerciseMap(IndExercise indExercise){
        WritableNativeMap indExerciseMap = new WritableNativeMap();

        indExerciseMap.putString("id", indExercise.getId().toHexString());
        indExerciseMap.putString("name", indExercise.getName());

        return indExerciseMap;
    }

    private WritableNativeMap toExerciseMap(Exercise exercise){
        WritableNativeMap exerciseMap = new WritableNativeMap();

        exerciseMap.putString("id", exercise.getId().toHexString());
        exerciseMap.putString("indExerciseId", exercise.getIndExerciseId().toHexString());
        exerciseMap.putString("name", getIndExerciseName(exercise.getIndExerciseId()));
        exerciseMap.putString("setId", exercise.getSetId().toHexString());
        exerciseMap.putInt("sets", exercise.getSets());
        exerciseMap.putInt("reps", exercise.getReps());

        return exerciseMap;
    }

    // helper functions for toSetMap
    private WritableNativeArray exercisesInSet(String setId) {
        Realm realm = Realm.getDefaultInstance();

        ObjectId sId = new ObjectId(setId);

        RealmQuery<Exercise> exercises = realm.where(Exercise.class)
                .equalTo("setId", sId);

        if(exercises == null) {
            return null;
        } else {
            WritableNativeArray exercisesArray = toExercisesArray(exercises);
            return exercisesArray;
        }
    }

    public WritableNativeArray toExercisesArray(RealmQuery<Exercise> exercises) {

        WritableNativeArray exercisesArray = new WritableNativeArray();

        for(Exercise exercise: exercises.findAll()) {
            exercisesArray.pushMap(toExerciseMap(exercise));
        }

        return exercisesArray;
    }

    private WritableNativeMap toSetMap(Set set){

        WritableNativeMap setMap = new WritableNativeMap();

        setMap.putString("id", set.getId().toHexString());
        setMap.putString("workoutId", set.getWorkoutId().toHexString());
        // store exercises with names
        WritableNativeArray exercisesArray = exercisesInSet(set.getId().toHexString());
        setMap.putArray("exercises", exercisesArray);

        return setMap;
    }

    private WritableNativeArray toRegimesArray(RealmQuery<Regime> regimes) {
        WritableNativeArray regimesArray = new WritableNativeArray();


        for (Regime regime : regimes.findAll()) {
            regimesArray.pushMap(this.toRegimeMap(regime));
        }

        return regimesArray;
    }


    private WritableNativeArray toIndExercisesArray(RealmQuery<IndExercise> indExercises) {
        WritableNativeArray indExercisesArray = new WritableNativeArray();

        for (IndExercise indExercise : indExercises.findAll()) {
            indExercisesArray.pushMap(this.toIndExerciseMap(indExercise));
        }

        return indExercisesArray;
    }

    private WritableNativeMap toWorkoutsMap(String regimeId, RealmQuery<Workout> workouts) {
        WritableNativeMap workoutsMap = new WritableNativeMap();
        workoutsMap.putString("id", regimeId);

        WritableNativeArray workoutsArray = new WritableNativeArray();

        for (Workout workout : workouts.findAll()) {
            workoutsArray.pushMap(this.toWorkoutMap(workout));
        }

        workoutsMap.putArray("workouts", workoutsArray);

        return workoutsMap;
    }

    private WritableNativeMap toSetsMap(String workoutId, RealmQuery<Set> sets) {
        WritableNativeMap setsMap = new WritableNativeMap();
        setsMap.putString("id", workoutId);

        WritableNativeArray setsArray = new WritableNativeArray();

        for (Set set : sets.findAll()) {
            setsArray.pushMap(this.toSetMap(set));
        }

        setsMap.putArray("sets", setsArray);

        return setsMap;
    }

    private WritableNativeMap toExercisesMap(String setId, RealmQuery<Exercise> exercises) {
        WritableNativeMap exercisesMap = new WritableNativeMap();
        exercisesMap.putString("id", setId);

        WritableNativeArray exercisesArray = new WritableNativeArray();

        for(Exercise exercise: exercises.findAll()) {
            exercisesArray.pushMap(toExerciseMap(exercise));
        }

        exercisesMap.putArray("exercises", exercisesArray);

        return exercisesMap;
    }

    // CREATE
    @ReactMethod
    public void createRegime(String name, Promise promise) {
        Realm realm = Realm.getDefaultInstance();

        Regime regime = new Regime(name);

        realm.executeTransaction(transactionRealm -> {
            transactionRealm.insert(regime);
        });

        promise.resolve(regime.getId().toHexString());

    }

    @ReactMethod
    public void createWorkout(String name, String regimeId, Promise promise) {
        Realm realm = Realm.getDefaultInstance();

        ObjectId rId = new ObjectId(regimeId);
        Workout workout = new Workout(name, rId);

        realm.executeTransaction(transactionRealm -> {
            transactionRealm.insert(workout);
        });

        promise.resolve(workout.getId().toHexString());

    }

    @ReactMethod
    public void createSet(String workoutId, Promise promise) {
        Realm realm = Realm.getDefaultInstance();

        ObjectId wId = new ObjectId(workoutId);
        Set set = new Set(wId);

        realm.executeTransaction(transactionRealm -> {
            transactionRealm.insert(set);
        });

        promise.resolve(set.getId().toHexString());

    }

    @ReactMethod
    public void selectExercise(String setId, String indExerciseId, int sets, int reps, Promise promise) {
        Realm realm = Realm.getDefaultInstance();

        ObjectId iId = new ObjectId(indExerciseId);
        ObjectId sId = new ObjectId(setId);
        Exercise exercise = new Exercise(iId, sId, sets, reps);

        realm.executeTransaction(transactionRealm -> {
            transactionRealm.insert(exercise);
        });

        promise.resolve(true);

    }

    @ReactMethod
    public void createExercise(String setId, String name, int sets, int reps, Promise promise) {
        Realm realm = Realm.getDefaultInstance();

        IndExercise indExercise = new IndExercise(name);

        realm.executeTransaction(transactionRealm -> {
            transactionRealm.insert(indExercise);
        });

        ObjectId iId = indExercise.getId();
        ObjectId sId = new ObjectId(setId);
        Exercise exercise = new Exercise(iId, sId, sets, reps);

        realm.executeTransaction(transactionRealm -> {
            transactionRealm.insert(exercise);
        });

        promise.resolve(true);

    }

    // READ
    @ReactMethod
    public void readRegime(String regimeId, Promise promise){
        Realm realm = Realm.getDefaultInstance();

        ObjectId rId = new ObjectId(regimeId);

        Regime regime = realm.where(Regime.class)
                .equalTo("id", rId)
                .findFirst();

        if(regime == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            // CREATE MAP FOR REGIME
            WritableNativeMap regimeMap = this.toRegimeMap(regime);

            promise.resolve(regimeMap);
        }
    }

    @ReactMethod
    public void readWorkout(String workoutId, Promise promise){
        Realm realm = Realm.getDefaultInstance();

        ObjectId wId = new ObjectId(workoutId);

        Workout workout = realm.where(Workout.class)
                .equalTo("id", wId)
                .findFirst();

        if(workout == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            // CREATE MAP FOR WORKOUT
            WritableNativeMap workoutMap = this.toWorkoutMap(workout);

            promise.resolve(workoutMap);
        }
    }

    @ReactMethod
    public void readSet(String setId, Promise promise){
        Realm realm = Realm.getDefaultInstance();

        ObjectId sId = new ObjectId(setId);

        Set set = realm.where(Set.class)
                .equalTo("id", sId)
                .findFirst();

        if(set == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            // CREATE MAP FOR SET
            WritableNativeMap setMap = this.toSetMap(set);

            promise.resolve(setMap);
        }
    }

    @ReactMethod
    public void readExercise(String exerciseId, Promise promise){
        Realm realm = Realm.getDefaultInstance();

        ObjectId eId = new ObjectId(exerciseId);

        Exercise exercise = realm.where(Exercise.class)
                .equalTo("id", eId)
                .findFirst();

        if(exercise == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            // CREATE MAP FOR EXERCISE
            WritableNativeMap exerciseMap = this.toExerciseMap(exercise);

            promise.resolve(exerciseMap);
        }
    }

    @ReactMethod
    public void readRegimes(Promise promise){
        try {
            Realm realm = Realm.getDefaultInstance();

            RealmQuery<Regime> regimes = realm.where(Regime.class);

            if(regimes == null) {
                promise.reject(new Throwable("Nah."));
            } else {
                // CREATE ARRAY FOR REGIMES
                WritableNativeArray regimesArray = this.toRegimesArray(regimes);
                Log.i("regimesArray: ", regimesArray.toString());
                promise.resolve(regimesArray);
            }
        } catch (Exception e) {
            promise.reject(new Throwable("You got an error: " + e.getMessage()));
        }
    }

    @ReactMethod
    public void readIndExercises(Promise promise){
        try {
            Realm realm = Realm.getDefaultInstance();

            RealmQuery<IndExercise> indExercises = realm.where(IndExercise.class);

            if(indExercises == null) {
                promise.reject(new Throwable("Nah."));
            } else {
                // CREATE ARRAY FOR REGIMES
                WritableNativeArray indExercisesArray = this.toIndExercisesArray(indExercises);
                Log.i("indExercisesArray: ", indExercisesArray.toString());
                promise.resolve(indExercisesArray);
            }
        } catch (Exception e) {
            promise.reject(new Throwable("You got an error: " + e.getMessage()));
        }
    }

    @ReactMethod
    public void  readWorkoutByRegimeId(String regimeId, Promise promise){
        Realm realm = Realm.getDefaultInstance();

        ObjectId rId = new ObjectId(regimeId);

        RealmQuery<Workout> workouts = realm.where(Workout.class)
                .equalTo("regimeId", rId);

        if(workouts == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            // CREATE MAP FOR WORKOUTS
            WritableNativeMap workoutsMap = toWorkoutsMap(regimeId, workouts);
            Log.i("workoutsMap: ", workoutsMap.toString());
            promise.resolve(workoutsMap);
        }
    }

    @ReactMethod
    public void readSetByWorkoutId(String workoutId, Promise promise){
        Realm realm = Realm.getDefaultInstance();

        ObjectId wId = new ObjectId(workoutId);

        RealmQuery<Set> sets = realm.where(Set.class)
                .equalTo("workoutId", wId);

        if(sets == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            // CREATE MAP FOR SETS
            WritableNativeMap setsMap = toSetsMap(workoutId, sets);
            Log.i("setsMap: ", setsMap.toString());
            promise.resolve(setsMap);
        }
    }

    @ReactMethod
    public void readExerciseBySetId(String setId, Promise promise) {
        Realm realm = Realm.getDefaultInstance();

        ObjectId sId = new ObjectId(setId);

        RealmQuery<Exercise> exercises = realm.where(Exercise.class)
                .equalTo("setId", sId);

        if(exercises == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            WritableNativeMap exercisesMap = toExercisesMap(setId, exercises);
            promise.resolve(exercisesMap);
        }
    }

    // UPDATE

    // DELETE
}
