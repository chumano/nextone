# Install
1. Nodejs, OpenSDK11 + Android Studio
2. Set ANDROID_HOME and JAVA_HOME path

# Debug
Android:
Open cmd then run
```
adb logcat
```
# Build android
find text "CHANGE_ME" to config

##sửa storePassword và  keyPassword
```
cd android
./gradlew assembleRelease  #build apk
./gradlew bundleRelease     #build aab to upload google play

change  versionCode in android/app/buid.gradle
        versionName
```

# DeepLink
```
npx uri-scheme open "ucom://call" --android
npx uri-scheme open "ucom://call" --ios
```

# clean when change to local
```
.\gradlew.bat clean
```

##file build nằm ở 
```
android/app/build/outputs/apk/release/app-release.apk
```

# Deep-link
https://viblo.asia/p/deep-linking-voi-react-native-GrLZDXGVZk0

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
    
# Regiser Error
InvalidEmail	Email '{0}' is invalid.
InvalidUserName	User name '{0}' is invalid, can only contain letters or digits.
ConfirmPassword

DuplicateUserName	User name '{0}' is already taken.

PasswordTooShort	Passwords must be at least {0} characters.
PasswordRequiresDigit	Passwords must have at least one digit ('0'-'9').
PasswordRequiresLower	Passwords must have at least one lowercase ('a'-'z').
PasswordRequiresNonAlphanumeric	Passwords must have at least one non alphanumeric character.
PasswordRequiresUniqueChars	Passwords must use at least {0} different characters.
PasswordRequiresUpper	Passwords must have at least one uppercase ('A'-'Z').