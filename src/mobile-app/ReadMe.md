# Install
1. Nodejs, OpenSDK11 + Android Studio
2. Set ANDROID_HOME and JAVA_HOME path

# Debug
Android:
Open cmd then run
```
adb logcat
```

# Install IOS
1. Install XCode (Now 13.4)
2. brew install watchman
3. sudo gem install cocoapods
# FOR MAC M1:
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install (run at src/ios)

4. npx react-native start (run Metro Bundler)
5. Open new terminal: npx react-native run-ios (compile code ios)

# Lỗi khi dùng lệnh npx react-native run-ios

1. Lỗi unlink
    
    Cách sửa:
    
    - npx react-native unlink …
    - Remove node_modules
    - npm i
    - vào thư mục src/ios
    - pod install (hoặc arch -x86_64 pod install)
2. Lỗi produce multiple package
    
    Cách sửa:
    
    - Mở XCode import project
    - Nhấn vào Project → Build Phase
    - Remove hết phần duplicate ở Compile Sources (thay vì ở [CP] Copy Pods Resources)
    - Remove node_modules
    - npm i
    - vào thư mục src/ios
    - pod install (hoặc arch -x86_64 pod install)


# Lỗi khi dùng lệnh npx react-native run-android
    - cd android
    - chmod +x gradlew
    
