Pre-requisite
Login to the CometChat Dashboard.
Select an existing app or create a new one.
Go to "API & Auth Keys" section and copy the REST API key from the "REST API Keys" tab.
Go to the "Extensions" section and Enable the Push Notifications extension.
Go to the "Installed" tab in the same section and open the settings for this extension and Set the version to V2.
Also, save the REST API key in the Settings and click on Save.
Copy the APP_ID, REGION and AUTH_KEY for your app.

Build instructions

1)Open the reactNativePushNotification directory
2)Make sure you replace the APP_ID with your CometChat App ID and REGION with your app region and apiKey in the Constants file under resources folder.
3)add google-services,json in android folder and google-services.plist in ios. You can get this from firebase console
3)Run npm install in reactNativePushNotification. This will install node modules.
3)Run react-native run-android to run the app in android and react native run-ios to run the app on ios
