import React, { useCallback, useRef } from 'react'
import { Image, Pressable, Text, View } from "react-native";
import Colors from "./../../constants/Colors";
import * as WebBrowser from 'expo-web-browser';
import { useAuth, useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
     WebBrowser.warmUpAsync()
    return () => {
     WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreens() {

  const video = useRef(null);
  const signIn = useAuth();

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPressHandle = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' })
      })

      if (createdSessionId) {
        setActive({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
        // signIn();
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, []);

  return (
    <View style={{ 
      height: '100%',
      backgroundColor: Colors.WHITE,
     }}>
      {/* <Image
          source={require('./../../assets/images/background-login.jpeg')}
          style={{ 
            width: '100%',
            height: 430
           }}
        /> */}

      <Video
        ref={video}
        resizeMode='cover'
        shouldPlay
        isLooping
        source={require('./../../assets/images/fruit-video.mp4')}
        style={{ 
            width: '100%',
            height: '65%',
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
           }}
      />

        <View style={{ 
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          height: '35%'
         }}>
          <Text style={{ 
            fontFamily:'outfit-bold',
            fontSize: 30,
            textAlign: "center"
           }}>Hãy sẵn sàng đến với thế giới nông sản!</Text>
           <Text style={{ 
            fontFamily: 'outfit',
            fontSize: 18,
            textAlign: 'center',
            color: Colors.GRAY
            }}>Hãy biến cuộc sống của bạn trở thành màu xanh, khi đến với ứng dụng buôn bán nông sản...</Text>

        <TouchableOpacity 
          onPress={onPressHandle}
          style={{ 
            padding: 14,
            marginTop: 60,
            backgroundColor: Colors.PRIMARY,
            width: '100%',
            borderRadius: 14,
          }}
        >
          <Text style={{ 
            fontFamily: 'outfit-medium',
            fontSize: 22,
            textAlign: 'center',
           }}>Bắt Đầu Nào!</Text>
        </TouchableOpacity>

        </View>
    </View>
  )
}