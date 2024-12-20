import { View, Text, Image, ScrollView, Button } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router'
import { collection, doc } from 'firebase/firestore';
import Colors from '../../constants/Colors';

export default function OrderTracking() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Theo dõi đơn hàng Khách'
        });
    }, []);
    
  return (
    <ScrollView style={{ padding: 12, marginVertical: 20, height: '100%' }}>
      {/* field title of column header  */}
      <View style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 10,
        gap: 22,
        marginVertical: 22
       }}>
       <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        }}>
          <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'outfit-bold' }}>Thông tin</Text>
            <View style={{ gap: 8 }}>
              <Text>Đơn hàng: 01</Text>
              <Text>Họ tên: Thái 2</Text>
              <Text>Địa chỉ: 404/500</Text>
              <Text>Số điện thoại: 0900</Text>
              <Text>Tổng tiền: 92.000 vnđ</Text>

            </View>
          </View>
          <View>
            <Text style={{ fontFamily: 'outfit-bold' }}>Trạng thái</Text>
            <View style={{ marginTop: 22 }}>
              <Text style={{ color: Colors.SECONDARY }}>Đang giao</Text>
            </View>
          </View>
          <View>
            <Button title='Cập nhật'/>
          </View>
       </View>

        <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between' }}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/83/46/7a/83467aff2dcf65b48102e6fe567e8727.jpg' }}
            style={{ height:70, width:70 }}
          />
          <View>
            <Text>Tên: Cà chua giỏ</Text>
            <Text>Số lượng: 01</Text>
            <Text>Đơn giá: 22.000 vnđ</Text>
          </View>
        </View>

        <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between' }}>
          <Image
            source={{ uri: 'https://i.pinimg.com/236x/41/c6/8e/41c68e2bd1ae08197d14157912ad8665.jpg' }}
            style={{ height:70, width:70 }}
          />
          <View>
            <Text>Tên: Cà chua bao</Text>
            <Text>Số lượng: 01</Text>
            <Text>Đơn giá: 50.000 vnđ</Text>
          </View>
        </View>
        <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between' }}>
          <Image
            source={{ uri: 'https://i.pinimg.com/236x/16/60/3a/16603a7d5899f795429dc5e2689a0a00.jpg' }}
            style={{ height:70, width:70 }}
          />
          <View>
            <Text>Tên: Dưa chuột xanh</Text>
            <Text>Số lượng: 02</Text>
            <Text>Đơn giá: 10.000 vnđ</Text>
          </View>
        </View>
      </View>



      <View style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 10,
        gap: 22,
        marginVertical: 22
       }}>
       <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        }}>
          <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'outfit-bold' }}>Thông tin</Text>
            <View style={{ gap: 8 }}>
              <Text>Đơn hàng: 02</Text>
              <Text>Họ tên: Thái Thanh</Text>
              <Text>Địa chỉ: 502/HCM</Text>
              <Text>Số điện thoại: 09300</Text>
              <Text>Tổng tiền: 139.000 vnđ</Text>

            </View>
          </View>
          <View>
            <Text style={{ fontFamily: 'outfit-bold' }}>Trạng thái</Text>
            <View style={{ marginTop: 22 }}>
              <Text style={{ color: Colors.PRIMARY }}>Đã nhận</Text>
            </View>
          </View>
          <View>
            <Button title='Cập nhật'/>
          </View>
       </View>

        <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between' }}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/6b/11/e9/6b11e9d088c19ba78390df8f09c04dc0.jpg' }}
            style={{ height:70, width:70 }}
          />
          <View>
            <Text>Tên: Chuối nải</Text>
            <Text>Số lượng: 01</Text>
            <Text>Đơn giá: 39.000 vnđ</Text>
          </View>
        </View>

        <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between' }}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/bb/a7/e1/bba7e13e347e829cbc5d09835322dae2.jpg' }}
            style={{ height:70, width:70 }}
          />
          <View>
            <Text>Tên: Chuối sấy</Text>
            <Text>Số lượng: 02</Text>
            <Text>Đơn giá: 100.000 vnđ</Text>
          </View>
        </View>
      </View>
      


      <View style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 10,
        gap: 22,
        marginVertical: 22
       }}>
       <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        }}>
          <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'outfit-bold' }}>Thông tin</Text>
            <View style={{ gap: 8 }}>
              <Text>Đơn hàng: 03</Text>
              <Text>Họ tên: Phương Quỳnh</Text>
              <Text>Địa chỉ: Long hòa</Text>
              <Text>Số điện thoại: 08745</Text>
              <Text>Tổng tiền: 1.023.000 vnđ</Text>

            </View>
          </View>
          <View>
            <Text style={{ fontFamily: 'outfit-bold' }}>Trạng thái</Text>
            <View style={{ marginTop: 22 }}>
              <Text style={{ color: Colors.RED }}>Chưa lên đơn</Text>
            </View>
          </View>
          <View>
            <Button title='Cập nhật'/>
          </View>
       </View>

        <View style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between' }}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/42/6c/8a/426c8a4268dc46bd4f9ab915aae75369.jpg' }}
            style={{ height:70, width:70 }}
          />
          <View>
            <Text>Tên: Cherry Blue hạt nhỏ</Text>
            <Text>Số lượng: 01</Text>
            <Text>Đơn giá: 1.023.000 vnđ</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}