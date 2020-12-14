import React, {useEffect, useState} from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {CometChat} from '@cometchat-pro/react-native-chat';
import * as ImagePicker from 'react-native-image-picker';

export default function Home() {
  const [uid, setUid] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('user');
  useEffect(() => {
    checkExtension();
  });

  const checkExtension = async () => {
    const setting = await CometChat.getAppSettings();
    const extension = setting.extensions.filter(
      (ext) => ext.id == 'push-notification',
    );

    console.log('extension:', extension);
  };
  const sendMessage = () => {
    if (!uid) {
      alert('Enter UID');
      return false;
    }
    if (!message) {
      alert('Enter message');
      return false;
    }
    var receiverType =
      type == 'user'
        ? CometChat.RECEIVER_TYPE.USER
        : CometChat.RECEIVER_TYPE.GROUP;
    var textMessage = new CometChat.TextMessage(uid, message, receiverType);

    CometChat.sendMessage(textMessage).then(
      (message) => {
        console.log('message', message);
        alert('sent Successfully');
      },
      (error) => {
        console.log('Message sending failed with error:', error);
      },
    );
    setMessage('');
  };

  const initiateCall = (type) => {
    if (!uid) {
      alert('Enter UID');
      return false;
    }
    var call = new CometChat.Call(uid, type, 'user');
    CometChat.initiateCall(call).then((Call) => {
      CometChat.getUser(uid).then((user) => {
        alert('called successfully');
      });
    });
  };

  const imagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('rrs', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // console.log("ImagePicker Response: ", response);
        if (Platform.OS === 'ios' && response.fileName != undefined) {
          var ext = response.fileName.split('.')[1].toLowerCase();
          var type = this.getMimeType(ext);
          var name = response.fileName;
        } else {
          var type = response.type;
          var name = 'Camera_001.jpeg';
        }
        var file = {
          name: Platform.OS === 'android' ? response.fileName : name,
          type: Platform.OS === 'android' ? response.type : type,
          uri:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', ''),
        };
        sendMediaMessage(file);
      }
    });
  };

  const sendMediaMessage = (msg) => {
    let messageType = CometChat.MESSAGE_TYPE.IMAGE;
    var receiverType =
      type == 'user'
        ? CometChat.RECEIVER_TYPE.USER
        : CometChat.RECEIVER_TYPE.GROUP;
    var mediaMessage = new CometChat.MediaMessage(
      uid,
      msg,
      messageType,
      receiverType,
    );
    CometChat.sendMediaMessage(mediaMessage).then(
      (message) => {
        alert('send successfully');
      },
      (error) => {
        alert('something went wrong');
        console.log('Media message sending failed with error', error);
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          marginTop: '10%',
          color: '#FFF',
          fontSize: 26,
          marginLeft: '5%',
        }}>
        Push Notification
      </Text>

      <Input
        containerStyle={{marginTop: '10%'}}
        inputContainerStyle={{borderWidth: 0.5, vorderColor: '#000'}}
        placeholder={type == 'user' ? 'Enter UID here' : 'Enter Guid'}
        value={uid}
        onChangeText={(id) => setUid(id)}
      />

      <View
        style={{
          marginTop: '5%',
          paddingVertical: 20,
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#707070',
          marginHorizontal: '5%',
          borderRadius: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            setType('user');
          }}
          style={{
            width: '40%',
            backgroundColor: type == 'user' ? '#fff' : '#00000000',
            padding: 10,
            alignItems: 'center',
          }}>
          <Text>To User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setType('group');
          }}
          style={{
            width: '40%',
            backgroundColor: type != 'user' ? '#fff' : '#00000000',
            padding: 10,
            alignItems: 'center',
          }}>
          <Text>To Group</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 10,
          marginLeft: '5%',
        }}>
        Enter Text Message
      </Text>

      <Input
        containerStyle={{marginTop: 10}}
        inputContainerStyle={{borderWidth: 0.5, vorderColor: '#000'}}
        placeholder="message"
        value={message}
        onChangeText={(msg) => setMessage(msg)}
      />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: '5%',
          justifyContent: 'space-around',
        }}>
        <Button
          onPress={() => sendMessage()}
          containerStyle={{marginTop: 5, borderRadius: 8, width: '40%'}}
          titleStyle={{fontSize: 18}}
          title={'Text Message'}></Button>
        <Button
          onPress={() => imagePicker()}
          containerStyle={{marginTop: 5, borderRadius: 8, width: '40%'}}
          titleStyle={{fontSize: 18}}
          title={'Media Message'}></Button>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: '5%',
          justifyContent: 'space-around',
        }}>
        <Button
          onPress={() => initiateCall('audio')}
          containerStyle={{marginTop: 5, borderRadius: 8, width: '40%'}}
          titleStyle={{fontSize: 18}}
          title={'Audio Call'}></Button>
        <Button
          onPress={() => initiateCall('video')}
          containerStyle={{marginTop: 5, borderRadius: 8, width: '40%'}}
          titleStyle={{fontSize: 18}}
          title={'Video Call'}></Button>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: '5%',
          justifyContent: 'space-around',
        }}>
        <Button
          containerStyle={{marginTop: 5, borderRadius: 8, width: '40%'}}
          titleStyle={{fontSize: 18}}
          title={'Custom Message'}></Button>
      </View>
    </View>
  );
}
