import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';

export default function InvoicesHistory() {

    const user = useLocalSearchParams();
    const userID = user?.userId;
    // console.log(userID);
    const [transactions, setTransactions] = useState([]);
    const navigation = useNavigation();
    const [load, setLoad] = useState(false);

    const fetchTransactions = async () => {
      try {
        setLoad(true);
        const invoicesRef = collection(db, 'Invoices');
        const q = query(invoicesRef, where('userId', '==', userID));
        const snapshot = await getDocs(q);
        
        const fetchedTransactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử giao dịch:", error);
      } finally {
        setLoad(false);
      }
    };

    // Lấy dữ liệu từ Firestore khi trang được tải
  useEffect(() => {

    navigation.setOptions({
      title: 'Lịch sử hóa đơn đã mua',
    })

    fetchTransactions();
  }, [userID]);
  

  // Hàm định dạng tiền tệ VND
  const formatCurrencyVND = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };


  // Render từng thẻ giao dịch
  const renderTransactionItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.invoiceId}>Mã hóa đơn: {item.id}</Text>
      <Text style={styles.detail}>Số tiền: {formatCurrencyVND(item.total)} VND</Text>
      <Text style={styles.detail}>Phương thức thanh toán: {item.paymentMethod}</Text>
      <Text style={styles.detail}>Trạng thái: {item.status}</Text>
      <Text style={styles.detail}>Ngày tạo: {new Date(item.created_at.seconds * 1000).toLocaleDateString()}</Text>
      <Text style={styles.detail}>Tên người nhận: {item.shippingInfo.name}</Text>
      <Text style={styles.detail}>Địa chỉ giao hàng: {item.shippingInfo.address}</Text>
      <Text style={styles.detail}>Số điện thoại: {item.shippingInfo.phone}</Text>
      
      <Text style={styles.productHeader}>Sản phẩm đã mua:</Text>
      <FlatList
        data={item.products}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={styles.productItem}>
                    <Text style={styles.productText}>{item.name}</Text>
                    <Text style={styles.productText}>Số lượng: {item.quantity}</Text>
                    <Text style={styles.productText}>Giá: {formatCurrencyVND(item.price)} VND</Text>
                </View>
                <View>
                    <Image source={{ uri: item.imageUrl }} style={styles.imgContainerItem}/>
                </View>
            </View>
            // <View>
            //     <Image source={{ uri: item.imageUrl }} style={{ width: 50, height: 50 }}/>
            // </View>
        )}
      />
      

    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử giao dịch</Text>
        {transactions.length > 0 ? (
            <FlatList
                data={transactions}
                renderItem={renderTransactionItem}
                refreshing={load}
                onRefresh={fetchTransactions}
                keyExtractor={item => item.id}
            />
        ) : (
            <Text style={styles.noTransactions}>Không có lịch sử giao dịch nào!</Text>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: { 
      backgroundColor: Colors.LIGHT_PRIMARY, 
      padding: 15, 
      borderRadius: 10, 
      marginBottom: 15, 
    },
    imgContainerItem: {
      width: 70,
      height: 70,
      borderRadius: 15
    },
    invoiceId: { fontSize: 16, fontFamily: 'outfit-medium' },
    detail: { fontSize: 14, color: '#555', fontFamily: 'outfit' },
    noTransactions: { textAlign: 'center', fontSize: 16, color: '#888', fontFamily: 'outfit-medium' },
    productHeader: { marginTop: 10, fontFamily: 'outfit-medium' },
    productItem: { 
        paddingLeft: 10, 
        paddingTop: 5,
        borderTopWidth:1,
        borderLeftWidth: 2,
        borderRightWidth:1,
        borderBottomWidth:3,
         marginVertical: 10,
         width: '70%',
         borderRadius: 10
    },
    productText: { fontSize: 14, color: Colors.SECONDARY },
  });