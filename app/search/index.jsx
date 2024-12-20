import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import VeListItem from './../../components/Home/VeListItem'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { FullWindowOverlay } from 'react-native-screens';


export default function SearchResult() {

    const navigation = useNavigation();
    const {query: searchQuery} = useLocalSearchParams();
    // console.log(products);
    const [products, setProducts] = useState([]);


    useEffect(() => {
      navigation.setOptions({
        headerTitle: 'Kết quả tìm kiếm của ' + "'"+searchQuery+"'"
    })

      //Taoj query de truy van du lieu lay thong tin tim kiem san pham
      const fetchProducts = async () => {
        const q = query(collection(db, 'Products'), where('name', '>=', searchQuery), where('name', '<=', searchQuery+'\uf8ff'));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      };
  
      if (searchQuery) {
        fetchProducts();
      }else{
        setProducts([]);
      }
    }, [searchQuery])

      // console.log(products);

      const renderProduct = ({ item }) => (
        // <TouchableOpacity>
        //   <Text>{item.name}</Text>
        //   <Text>{item.category}</Text>
        //   <Text>{item.description}</Text>
        // </TouchableOpacity>
        <VeListItem pet={item} key={item.id}/>
      );
    
  return (
    <View>
      <FlatList
            data={products}
            renderItem={renderProduct}
            style={{
              width: FullWindowOverlay,
              height: '100%',
              }}
          />
    </View>
  )
}