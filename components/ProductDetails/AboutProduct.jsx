import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors';

export default function AboutProduct({pet}) {

    const [readMore, setReadMore] = useState(true);

  return (
    <View style={{ 
        padding: 20
     }}>
      <Text style={{ 
        fontFamily: 'outfit-medium',
        fontSize: 20
       }}>Về {pet?.name}</Text>

       <Text numberOfLines={readMore?3:20} style={{ 
        fontFamily: 'outfit',
        fontSize: 14,
        }}>{pet?.note}</Text> 
        {readMore&&
        <TouchableOpacity onPress={()=>setReadMore(false)}>
            <Text style={{ 
                fontFamily: 'outfit-medium',
                fontSize: 14,
                color: Colors.SECONDARY
            }}>Đọc thêm</Text>
         </TouchableOpacity>
         }
    </View>
  )
}