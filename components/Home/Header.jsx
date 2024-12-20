import { View, Text, Image } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Header() {
  const {user} = useUser();
  const router = useRouter();

  return (
    <View style={{ 
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
     }}>
        <View>
            <Text
            style={{ 
              fontFamily: 'outfit',
              fontSize: 16,
              margin: 10
             }}>Chào mừng bạn đến với UDBBNS, </Text>
            <Text style={{ 
              fontFamily: 'outfit-medium',
              fontSize: 25,
              marginLeft: 12
             }}>{user?.fullName}</Text>
        </View>
        <TouchableOpacity
        onPress={()=>router.replace('/(tabs)/profile')}
        >
        <Image 
          source={{ uri: user?.imageUrl }}
          style={{ 
            width: 40,
            height: 40,
            borderRadius: 99
           }}
        />
        </TouchableOpacity>
    </View>
  )
}