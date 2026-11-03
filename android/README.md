# TOKYO INTELLIGENCE · Android APK source

Project builds with Android SDK 35, Gradle 8.9, JDK 17 and Android Gradle Plugin 8.7.3. This is a debug build for local testing, not a production-signed APK.

The GitHub workflow copies all static website files from `tokyo/` into `android/app/src/main/assets` before compiling. AndroidX WebViewAssetLoader serves the app securely from `https://appassets.androidplatform.net/assets/index.html`, without requiring the deployed site.

Actual online map tiles and external photos require an internet connection. The rest of the local itinerary/checklist app can open offline; the app has no account authentication or shared cloud backend.

Build locally: `cd android && gradle assembleDebug`. APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.
