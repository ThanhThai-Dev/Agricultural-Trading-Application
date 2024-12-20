import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, Button } from 'react-native';
import { addProductFromCart, addProductToUserCart, deleteCartItem, deleteProductById, getCartItems, removeProductFromCart, updateCartItem } from '../../Model/Cart';
import { db } from '../../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function CartItemInfo ({ userId }) {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchCartData();
  }, [userId]); 

  const fetchCartData = async () => {
    try {
      const data = await getCartItems(userId); // Truyền userId vào hàm
      setCartData(data[0]); // Lấy giỏ hàng đầu tiên của người dùng
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
    } finally {
      setLoading(false)
    }
  };

  // Hàm định dạng tiền tệ VND
  const formatCurrencyVND = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


  return (
    <View style={styles.card}>
      {/* <Text style={styles.title}>Giỏ hàng của người dùng: {cartData.userId}</Text> */}
      {/* <Text style={styles.subtitle}>Ngày tạo: {convertFirestoreTimestampToDate(cartData.created_at)?.toLocaleString()}</Text> */}

      <FlatList
        data={cartData.products}
        keyExtractor={(product) => product.productId}
        refreshing={loading}
        onRefresh={fetchCartData}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <View style={styles.infoProduct}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text>Giá mỗi đơn vị: {formatCurrencyVND(item.price)} VND</Text>
                <Text>Tổng: {formatCurrencyVND(item.quantity * item.price)} VND</Text>
            </View>

            <View>
                <Image 
                    source={{ uri: item.imageUrl }}
                    style={styles.productImage}
                />
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>Tổng cộng: {formatCurrencyVND(cartData.total)} VND</Text>
      <Text style={styles.status}>Trạng thái: "{cartData.status}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    height: '85%'
  },
  handleBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  infoProduct: {
    maxWidth: '70%',
  },
  btnDelItem: {
    marginTop: 10,
    borderWidth: 1,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: Colors.RED,
  },
  btnAddItem: {
    marginTop: 10,
    borderWidth: 1,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: 'outfit-medium'
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontFamily: 'outfit'
  },
  productContainer: {
    marginVertical: 4,
    padding: 8,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productName: {
    fontSize: 22,
    fontFamily: 'outfit-medium',
    marginBottom: 22,
    fontWeight: 'bold'
  },
  total: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: 'outfit-medium'
  },
  status: {
    fontSize: 16,
    color: Colors.SECONDARY,
    marginTop: 6,
    fontFamily: 'outfit'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'outfit-medium'
  },
  emptyCartText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 32,
    fontFamily: 'outfit'
  },
});