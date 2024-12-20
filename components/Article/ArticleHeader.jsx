import { View, Text, Image } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import Colors from '../../constants/Colors';

export default function ArticleHeader({ data }) {
    const {user} = useUser();
    // const userId = user?.primaryEmailAddress?.emailAddress;
    // const userId
    // console.log(data);
    // const fetchUserFromData = async() => {
    //     await
    // }
  return (
    <View style={{ 
        marginTop: 30,
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 22,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
     }}>

     {/* Info header screen  */}
      <View>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 18 }}>Chào mừng, {user?.fullName}</Text>
        <Text style={{ fontFamily: 'outfit-medium', fontSize: 16 }}>cùng khám phá nào!</Text>
      </View>

     {/* image user  */}
      <View>
        <Image
            source={{ uri: user?.imageUrl }}
            style={{ height: 40, width: 40, borderRadius: 99 }}
        />
      </View>

    </View>
  )
}