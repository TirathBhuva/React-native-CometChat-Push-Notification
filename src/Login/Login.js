import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {CometChat} from '@cometchat-pro/react-native-chat';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

let appID = '24958738083736c';
let apiKey = '8a5eb7dfb907f21dd697cf3e4cce4263f487d65d';
let appRegion = 'us';
export default function Login({navigation}) {
  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('message received', remoteMessage);
      console.log({title: remoteMessage.data.title, body: remoteMessage.data.alert})
      let isIOS = Platform.OS === 'ios';
      if(isIOS){
        await notifee.displayNotification({
          title: remoteMessage.data.title,
          body: remoteMessage.data.alert,
          ios: {
            foregroundPresentationOptions: {
              critical: true,
              alert: true,
              badge: true,
              sound: true,
            },
          },
        });
      }else{
        console.log('android');
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
        let result = await notifee.displayNotification({
          title: remoteMessage.data.title,
          body: remoteMessage.data.alert,
          android: {
            channelId
          },
        });
        console.log(result);
      }
    });
    let cometChatSettings = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(appRegion)
      .build();
    CometChat.init(appID, cometChatSettings).then(
      () => {
        console.log('Initialization completed successfully');
        //You can now call login function.
      },
      (error) => {
        console.log('Initialization failed with error:', error);
        //Check the reason for error and take apppropriate action.
      },
    );
  }, []);

  const registerForFCM = async (id) => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      let FCMToken = await messaging().getToken();
      console.log('token:', FCMToken);
      let response = await CometChat.registerTokenForPushNotification(FCMToken);
      console.log('register fro fcm :', response);
    }
  };

  const login = (uid) => {
    CometChat.login(uid, apiKey).then(
      (User) => {
        console.log('Login Successful:', {User});
        registerForFCM(User.uid);

        // User loged in successfully.
        navigation.navigate('Home');
      },
      (error) => {
        console.log('Login failed with exception:', {error});
        // User login failed, check error and take appropriate action.
      },
    );
  };
  return (
    <View style={{flex: 1}}>
      <View style={{marginLeft: '5%', marginTop: '10%'}}>
        <Image
          style={{
            height: 100,
            aspectRatio: 1,
          }}
          source={require('@icons/cometchat_white.png')}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 26,
            color: '#707070',
            marginTop: 10,
          }}>
          CometChat
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 26,
            color: '#0099FF',
            marginTop: 10,
          }}>
          Push Notification Sample App
        </Text>
      </View>
      <View style={{flex: 1, marginTop: 10, padding: '5%'}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            color: '#707070',
            marginTop: 10,
          }}>
          Login with one of our sample users
        </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
          <TouchableOpacity
            onPress={() => login('SUPERHERO1')}
            style={{
              backgroundColor: '#000',
              width: '40%',
              margin: '5%',
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 18}}>SUPERHERO1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => login('SUPERHERO2')}
            style={{
              backgroundColor: '#000',
              width: '40%',
              margin: '5%',
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 18}}>SUPERHERO2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => login('SUPERHERO3')}
            style={{
              backgroundColor: '#000',
              width: '40%',
              margin: '5%',
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 18}}>SUPERHERO3</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => login('SUPERHERO4')}
            style={{
              backgroundColor: '#000',
              width: '40%',
              margin: '5%',
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 18}}>SUPERHERO4</Text>
          </TouchableOpacity>
        </View>

        <Input
          style={{marginTop: 5}}
          placeholder={'or else continue login with uid'}
        />
        <Button
          buttonStyle={{marginTop: 5, backgroundColor: '#000'}}
          titleStyle={{fontSize: 18}}
          title={'LOGIN USING UID'}></Button>
      </View>
    </View>
  );
}
