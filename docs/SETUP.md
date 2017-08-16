# Installation and setup

`react-native-material-palette` is a native module written in Kotlin, thus you need to follow the instructions below in order to set it up.

## Setup instructions

1. Install module using npm or yarn:
```bash
yarn add react-native-material-palette
```

### RN 0.47 or higher

2. Link the native library's dependencies
```bash
react-native link react-native-material-palette
```

### RN < 0.47
Linking modules written in Kotlin is only supported from RN 0.47 on. For lower versions, you'll have to follow the manual steps described below.

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

4. Add the following lines to `android/app/src/build.gradle`:
```diff
// ...

dependencies {
+   compile project(':react-native-material-palette')
    compile fileTree(dir: "libs", include: ["*.jar"])
+   compile "com.android.support:appcompat-v7:24.0.1" // Or version 25, depends on your project compileSdkVersion 
    compile "com.facebook.react:react-native:+"  // From node_modules
}

// ...
```
