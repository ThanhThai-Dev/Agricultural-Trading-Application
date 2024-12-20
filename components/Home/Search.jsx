import { View, Text, TextInput, StyleSheet, Animated, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import { db } from '../../config/FirebaseConfig';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FullWindowOverlay } from 'react-native-screens';
import VeListItem from './VeListItem';

export default function Search() {

    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const router = useRouter();

    useEffect(() => {

      //Taoj query de truy van du lieu lay thong tin tim kiem san pham
      const fetchProducts = async () => {
        const q = query(collection(db, 'Products'), where('name', '>=', searchTerm));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => doc.data());
        setProducts(productsData);
      };
  
      if (searchTerm) {
        fetchProducts();
      }else{
        setSearchTerm([]);
        setProducts([]);
      }
    }, [searchTerm]);

    const handleSearch = () => {
      if(searchTerm){
        router.push({
          pathname: '/search',
          params: {
            query: searchTerm
          }
        })
      }
    }

  const renderProduct = ({ item }) => (
    <VeListItem pet={item} key={item.id}/>
  );

  // console.log(products);
    

  return (
    <View style={styles.container}>
        <View style={styles.searchBar}>
            <TextInput
                style={styles.searchInput}
                placeholder='Tìm kiếm sản phẩm cho riêng bạn' 
                onChangeText={setSearchTerm}
                value={searchTerm} 
            />
            <TouchableOpacity
            onPress={handleSearch}
            style={styles.handleSearch}>
                <AntDesign name="search1" size={25} color="black" />
            </TouchableOpacity>
        </View>

        {/* <View>
          <FlatList
            data={products}
            renderItem={renderProduct}
            style={{
              width: FullWindowOverlay, 
              height: 500, 
              borderWidth: 1, 
              marginTop: 8, 
              borderBottomLeftRadius: 15, 
              borderBottomRightRadius: 15, 
              padding: 8 }}
          />
        </View> */}

        {/* <View>
        {searchTerm? (
          <ScrollView>
            <FlatList
              data={products}
              style={{ width: 100, height: 100 }}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
        ): (
          <Text>What are you want to search</Text>
        )}
        </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 12
    },
    searchBar:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 10,
        fontFamily: 'outfit-medium'
    },
    handleSearch: {
        padding: 12,
        borderWidth: 2,
        marginLeft: 8,
        borderRadius: 15,
        borderColor: '#000',
        backgroundColor: Colors.SECONDARY
    }
})