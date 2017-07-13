# Installation and setup

`react-native-material-palette` is a native module written in Kotlin, thus you need to follow the instructions below in order to set it up.

Once the React Native team releases a new version with the [following change](https://github.com/facebook/react-native/commit/d666f30665e4cd336e1a1017954447f486a3e8ce), you will be able to use `react-native link react-native-material-palette`, but for now you have to do it manually.

## Compatibility

Material Palette SDK is __only available in Android 24 or higher__. We __recommend__ using version __25__.

If you're using a lower version, you need to add
```
compile 'com.android.support:support-v4:24.2.0'
```
to `andoid/app/src/build.gradle` in `dependencies` section.

## Setup instructions

1. Install module using npm or yarn:
```
$ yarn add react-native-material-palette
```

2. Add the following lines to `android/settings.gradle`:
```diff
rootProject.name = 'YourProjectName'
+ include ':react-native-material-palette'
+ project(':react-native-material-palette').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-material-palette/android')
include ':app'
```

3. Add the following lines to `android/app/src/main/java/com/<YourProjectName>/MainApplication.java`:
```diff
// ...

+ import io.callstack.react_native_material_palette.MaterialPalettePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    // ...

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
+         new MaterialPalettePackage()
      );
    }
  };

  // ...
}

```

4. Add the following line to `android/app/src/build.gradle`:
```diff
// ...

dependencies {
+   compile project(':react-native-material-palette')
    compile fileTree(dir: "libs", include: ["*.jar"])
    compile "com.android.support:appcompat-v7:25.0.1" // Or version 24, depends on your project compileSdkVersion 
    compile "com.facebook.react:react-native:+"  // From node_modules
}

// ...
```
