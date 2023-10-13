package com.proverloadv2;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.proverloadv2.modules.FitnessModule;
import com.proverloadv2.modules.TestModule;
import com.proverloadv2.modules.AuthModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ProverloadPackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new TestModule(reactContext));
        modules.add(new AuthModule(reactContext));
        modules.add(new FitnessModule(reactContext));

        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
