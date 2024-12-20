import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo';
import CartItemInfo from '../../components/Cart/CartItemInfo';
import { useNavigation, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

export default function ShippingInfo() {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');


    const navigation = useNavigation();
    const router = useRouter();

    const handleConfirmShippingInfo = () => {
        if (!name || !phone || !address) {
          return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin nhận hàng.");
        }
    
        const shippingInfo = { name, phone, address };
        // console.log(shippingInfo)

        router.push({
            pathname: 'payment-method',
            params: {name, phone, address}
        })
    };

    useEffect(()=>{
        navigation.setOptions({
            headerTitle: 'Vui lòng nhập thông tin'
        })
    });


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vui lòng nhập thông tin giao hàng:</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên người nhận"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ giao hàng"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmShippingInfo}>
        <Text style={{ fontFamily: 'outfit-medium', fontSize: 16 }}>Xác nhận và thanh toán</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 20, marginBottom: 20, fontFamily: 'outfit-bold' },
    // input: { borderBottomWidth: 1, padding: 10, marginVertical: 10 },
    btnConfirm: {
        padding: 16,
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 25,
        alignItems: 'center'
    },
    input: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit',
        marginVertical: 15,
        borderWidth: 1,
    }
  });