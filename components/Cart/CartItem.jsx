import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, Button } from 'react-native';
import { addProductFromCart, addProductToUserCart, deleteCartItem, deleteProductById, getCartItems, removeProductFromCart, updateCartItem } from '../../Model/Cart';
import { db } from '../../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { doc, getDoc } from 'firebase/firestore';


export default function CartItem ({ userId }) {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchCartData = async () => {
    try {
      const data = await getCartItems(userId); // Truyền userId vào hàm
      setCartData(data[0]); // Lấy giỏ hàng đầu tiên của người dùng
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveQuantityProduct = async(productId, quantityRemove) => {
    try {
      await removeProductFromCart(userId, productId, quantityRemove);
      Alert.alert("Thông báo", "Đã cập nhật xóa sản phẩm trong giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  }

  const handleAddToCart = async(productId) => {
    try {
      await addProductFromCart(userId, productId, 1);
      Alert.alert("Thông báo", "Đã cập nhật tăng số lượng sản phẩm trong giỏ hàng");
    } catch (error) {
      
    }
  }

  // Hàm định dạng tiền tệ VND
  const formatCurrencyVND = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  const handleInvoicesHistory = () => {
    router.push({
      pathname: 'invoices-history',
      params: {userId}
    })
  }

  useEffect(() => {
    
    fetchCartData();
  }, [userId]); 

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!cartData) {
    return <FlatList
        data={cartData}
        refreshing={loading}
        onRefresh={fetchCartData}
        renderItem={({ item }) => (
          <Text>Bạn hiện tại không có sản phẩm nào...</Text>
        )}
      />
    ;
  }

  return (
    <View style={styles.card}>
      {/* <Text style={styles.title}>Giỏ hàng của người dùng: {cartData.userId}</Text> */}
      {/* <Text style={styles.subtitle}>Ngày tạo: {convertFirestoreTimestampToDate(cartData.created_at)?.toLocaleString()}</Text> */}

      <FlatList
        data={cartData.products}
        refreshing={loading}
        onRefresh={fetchCartData}
        renderItem={({ item, index }) => (
          <View style={styles.productContainer} key={index}>
            <View style={styles.infoProduct}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text>Giá mỗi đơn vị: {formatCurrencyVND(item.price)} VND</Text>
                <Text>Tổng: {formatCurrencyVND(item.quantity * item.price)} VND</Text>
            </View>

            <View>
                <Image 
                    source={{ uri: item?.imageUrl }}
                    style={styles.productImage}
                />
                <View style={styles.handleBtnContainer}>
                  {/* them san pham  */}
                  <TouchableOpacity 
                    onPress={() => handleAddToCart(item.productId)}
                    style={styles.btnAddItem}
                  >
                    <AntDesign name="pluscircleo" size={22} color={Colors.WHITE} />
                  </TouchableOpacity>

                  {/* xoa san pham  */}
                  <TouchableOpacity 
                    onPress={()=>handleRemoveQuantityProduct(item.productId, 1)}
                    style={styles.btnDelItem}
                  >
                    <AntDesign name="minuscircleo" size={22} color="black" />
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footerContainerItem}>
        <View>
          <Text style={styles.total}>Tổng cộng: {formatCurrencyVND(cartData.total)} VND</Text>
          <Text style={styles.status}>Trạng thái: "{cartData.status}"</Text>
        </View>
        <View style={styles.btnHistoryInvoiceContainer}>
          <TouchableOpacity style={{ padding: 8 }} onPress={handleInvoicesHistory}>
            <Text style={{ fontFamily: 'outfit', fontSize: 12 }}>Lịch sử đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnHistoryInvoiceContainer: {
    borderWidth: 1,
    borderRadius: 10,
  },
  footerContainerItem:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '20%',
    borderTopWidth: 1,
    borderLeftWidth: 2,
    borderBottomWidth: 3,
    padding: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
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
    fontFamily: 'outfit',
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
    marginVertical: 12,
    fontFamily: 'outfit-medium'
  },
  status: {
    fontSize: 16,
    color: Colors.SECONDARY,
    marginTop: 20,
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