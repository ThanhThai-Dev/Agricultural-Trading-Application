import { View, Text } from 'react-native'
import React from 'react'

export default function Success() {
  return (
    <View style={{ 
        padding: 20,
        alignItems: 'center'
     }}>
      <Text style={{ fontFamily: 'outfit', fontSize: 16 }}>Chúc mừng bạn đã thanh toán thành công</Text>
    </View>
  )
}