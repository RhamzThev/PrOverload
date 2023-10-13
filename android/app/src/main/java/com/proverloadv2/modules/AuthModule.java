package com.proverloadv2.modules;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeMap;
import com.proverloadv2.models.auth.User;

import io.realm.Realm;

public class AuthModule extends ReactContextBaseJavaModule {

    public AuthModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() { return "AuthModule"; }

    /**
     * Determines if user with given username exists.
     *
     * @param username  The attempted username.
     * @param realm     The opened realm.
     * @return          true if a user with the given username exists in the realm. false if otherwise.
     */
    private boolean userExists(String username, Realm realm) {
        return realm.where(User.class)
                .equalTo("username", username)
                .findFirst() != null;
    }

    /**
     * Determines if a user with the given credentials exists.
     *
     * @param username  The attempted username.
     * @param password  The attempted password.
     * @param realm     The opened realm.
     * @return          true if the user credentials are valid. false if otherwise.
     */
    private boolean validCredentials(String username, String password, Realm realm) {
        return realm.where(User.class)
                .equalTo("username", username)
                .and()
                .equalTo("password", password)
                .findFirst() != null;
    }

    private WritableNativeMap toUserMap(String username, Realm realm) {
        WritableNativeMap userMap = new WritableNativeMap();

        User user = realm.where(User.class)
                .equalTo("username", username)
                .findFirst();

        userMap.putString("username", user.getUsername());
        userMap.putString("name", user.getName());
        userMap.putInt("age", user.getAge());
        userMap.putInt("weight", user.getWeight());
        userMap.putInt("height", user.getHeight());

        return userMap;
    }

    @ReactMethod
    public void name(String username, Promise promise) {
        // OPEN REALM
        Realm realm = Realm.getDefaultInstance();

        User user = realm.where(User.class)
                .equalTo("username", username)
                .findFirst();

        if(user == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            promise.resolve(user.getName());
        }
    }

    @ReactMethod
    public void age(String username, Promise promise) {
        // OPEN REALM
        Realm realm = Realm.getDefaultInstance();

        User user = realm.where(User.class)
                .equalTo("username", username)
                .findFirst();

        if(user == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            promise.resolve(user.getAge());
        }
    }

    @ReactMethod
    public void weight(String username, Promise promise) {
        // OPEN REALM
        Realm realm = Realm.getDefaultInstance();

        User user = realm.where(User.class)
                .equalTo("username", username)
                .findFirst();

        if(user == null) {
            promise.reject(new Throwable(""));
        } else {
            promise.resolve(user.getWeight());
        }
    }

    @ReactMethod
    public void height(String username, Promise promise) {
        // OPEN REALM
        Realm realm = Realm.getDefaultInstance();

        User user = realm.where(User.class)
                .equalTo("username", username)
                .findFirst();

        if(user == null) {
            promise.reject(new Throwable("Nah."));
        } else {
            promise.resolve(user.getHeight());
        }
    }

    /**
     * Attempts to log in user with given credentials.
     *
     * @param username  The attempted username.
     * @param password  The attempted password.
     * @return  true if user can be logged in. false if otherwise.
     */
    @ReactMethod
    public void logIn(String username, String password, Promise promise) {
        // OPEN REALM
        Realm realm = Realm.getDefaultInstance();

        WritableNativeMap output = new WritableNativeMap();

        // Check if username and password is correct
        if (!username.isEmpty() && !password.isEmpty()) {
            if (userExists(username, realm)) {
                if(validCredentials(username, password, realm)) {
                    output.putBoolean("status", true);
                    output.putMap("info", toUserMap(username, realm));
                } else {
                    output.putBoolean("status", false);
                    output.putString("info", "Invalid password. Please try again.");
                }
            } else {
                output.putBoolean("status", false);
                output.putString("info", "Username does not exist. Please try again.");
            }
        } else {
            output.putBoolean("status", false);
            output.putString("info", "One or more input fields are empty. Please try  again.");
        }

        promise.resolve(output);
    }

    /**
     * Creates user with the given information, and logs in created user.
     *
     * @param username  The username of the created user.
     * @param password  The password of the created user.
     * @param age       The age of the created user.
     * @param weight    The weight of the created user.
     * @param height    The height of the created user.
     */
    @ReactMethod
    public void signUp(String username, String password, String name, int age, int weight, int height, Promise promise) {
        //OPEN REALM
        Realm realm = Realm.getDefaultInstance();

        WritableNativeMap output = new WritableNativeMap();

        // IF USERNAME DOES NOT EXIST
        if(!username.isEmpty() && !password.isEmpty() && !name.isEmpty()) {
            if (!userExists(username, realm)) {
                // Create User object
                User user = new User(username, password, name, age, weight, height);

                // Add created user to the database
                realm.executeTransaction(transactionRealm -> {
                    transactionRealm.insert(user);
                });

                // Log the created user in.
                output.putBoolean("status", true);
                output.putMap("info", toUserMap(username, realm));

            } else {
                output.putBoolean("status", false);
                output.putString("info", "User already exists. Please try again.");
            }
        } else {
            output.putBoolean("status", false);
            output.putString("info", "One or more input fields are empty. Please try  again.");
        }

        // RESOLVE OUTPUT
        promise.resolve(output);
    }

}
