import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { Link } from 'expo-router'

export default function UserItem({userInfo}) {
  return (
    <TouchableOpacity>
    <Link href={'/chat?id='+userInfo.docId} >
      <View>
        <View style={{
            width: '100%', 
            marginVertical: 10,
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center'
        }}>
            <Image 
                source={{ uri: userInfo?.imageUrl }}
                style={{ 
                    width: 40,
                    height: 40,
                    borderRadius: 99
                }}
            />
            <Text style={{ 
                fontFamily: 'outfit',
                fontSize: 20
            }}>{userInfo?.name}</Text>
        </View>
        
      </View>
    </Link>
    <View style={{ borderWidth: 0.4, width: '100%', backgroundColor: Colors.GRAY}}>

    </View>
    </TouchableOpacity>
  )
}