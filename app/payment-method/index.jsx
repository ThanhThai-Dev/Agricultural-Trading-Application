import { Alert, Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CartItemInfo from '../../components/Cart/CartItemInfo';
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { checkoutCart } from '../../Model/Cart';

export default function PaymentMethod() {
    const {user} = useUser();
    const userId = user?.primaryEmailAddress?.emailAddress;
    const userName = user?.fullName;
    const {name, phone, address} = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState("");
    

    // console.log(name, phone, address);
    useEffect(()=>{
        navigation.setOptions({
            headerTitle: 'Xác nhận thông tin'
        })
    });

    const handleCheckout = async () => {
        if (!paymentMethod) {
          Alert.alert("Vui lòng chọn phương thức thanh toán!");
          return;
        }

        const shippingInfo = {name, phone, address}
    
        try {
          const invoiceId = await checkoutCart(userId, paymentMethod, shippingInfo, userName);
          Alert.alert("Thanh toán thành công!", `Mã hóa đơn: ${invoiceId}`);
          // Chuyển đến trang thông báo thành công hoặc trang khác
          router.push('/home'); // Đường dẫn đến trang thông báo thành công
        } catch (error) {
          Alert.alert("Lỗi thanh toán", "Đã có lỗi xảy ra, vui lòng thử lại.");
        }
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vui lòng chọn phương thức thanh toán !</Text>

    <View style={{ height: '80%' }}>
      <CartItemInfo userId={userId}/>
    </View>

      {/* <Text>{shipingInfo.name}</Text> */}

    <View style={styles.btnCheckMethod}>
        {/* tien mat  */}
        <TouchableOpacity
            style={{
            backgroundColor: paymentMethod === "cash" ? Colors.SECONDARY : "#f0f0f0",
            padding: 10,
            width: '50%',
            borderRadius: 8,
            borderWidth: 1
            }}
            onPress={() => setPaymentMethod("cash")}
        >
            <Text style={{ color: paymentMethod === "cash" ? Colors.GRAY : "#000" }}>Thanh toán tiền mặt</Text>
        </TouchableOpacity>

        {/* chuyen khoan  */}
        <TouchableOpacity
            style={{
            backgroundColor: paymentMethod === "transfer" ? Colors.SECONDARY : "#f0f0f0",
            padding: 10,
            borderRadius: 8,
            borderWidth: 1
            }}
            onPress={() => setPaymentMethod("transfer")}
        >
            <Text style={{ color: paymentMethod === "transfer" ? Colors.GRAY : "#000" }}>Chuyển khoản</Text>
        </TouchableOpacity>
    </View>

    {/* xac nhan thanh toan */}
    <TouchableOpacity style={styles.btnConfirm} onPress={handleCheckout}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 18 }}>Xác nhận thanh toán</Text>
    </TouchableOpacity>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    btnCheckMethod: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnConfirm: {
        width: '100%',
        borderWidth: 1,
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 12,
        marginTop: 12,
        borderRadius: 15,
        alignItems: 'center'
    }
  });