import { View, Text } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'

export default function About() {
  return (
    <View style={{ 
        padding: 10,
        marginVertical: 20
     }}>
      <Text style={{ 
        fontFamily: 'outfit',
        fontSize: 16,
        fontStyle: 'italic',
        color: Colors.GRAY,
       }}>-     Chúng tôi với cương vị là nhà sáng lập và cũng là người đã sáng tạo ra thế giới nông sản giúp kết nối mọi người lại với nhau
        thông qua việc trao đổi và mua bán trực tiếp thông qua 
        <Text style={{ fontFamily: 'outfit-medium',
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: Colors.GRAY,
         }}> tin nhắn và sự giao lưu</Text>, 
        kết bạn, giữa những 
        <Text style={{ fontFamily: 'outfit-medium',
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: Colors.GRAY,
         }}> nhà nông sản</Text>
        ,
        <Text style={{ fontFamily: 'outfit-medium',
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: Colors.GRAY,
         }}> chủ vựa nông sản</Text> 
        , và 
        <Text style={{ fontFamily: 'outfit-medium',
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: Colors.GRAY,
         }}> khách hàng
        thân thiết.</Text>  
      </Text>

      <Text style={{ 
            fontSize: 18,
            fontFamily: 'outfit-medium',
            fontStyle: 'italic',
            fontWeight: 'bold',
            color: Colors.GRAY,
            marginTop: 12
         }}>
            Chúng tôi cam kết sẽ phát triển thêm nhiều tính năng mới trong tương lai và giúp việc mua bán nông sản của bạn trở nên dễ dàng hơn so với
            trước đây. 
       </Text>
       <Text style={{ 
        fontFamily: 'outfit-bold',
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.SECONDARY,
        marginTop: 14
        }}>
        -- Hãy cùng chúng tôi xây dựng một thế giới nông sản tốt đẹp hơn --
       </Text>
    </View>
  )
}