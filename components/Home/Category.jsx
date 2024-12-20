import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';

export default function Category({ category }) {

    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Pig')
    const [loader, setLoader] = useState(false);

    useEffect(()=>{
        GetCategory();
    }, [])

    // get catagory from database 
    const GetCategory = async() => {
        setLoader(true);
        setCategoryList([])
        const snapshot = await getDocs(collection(db, 'Category'));
        snapshot.forEach((doc) => {
            // console.log(doc.data());
            setCategoryList(categoryList=>[...categoryList, doc.data()])
        })
        setLoader(false);
    }

  return (
    <View style={{ 
        marginTop: 20,
     }}>
      <Text style={{ 
        fontFamily: 'outfit-medium',
        fontSize: 20
       }}>Danh mục</Text>

       <FlatList
        data={categoryList}
        // numColumns={4}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        refreshing={loader}
        onRefresh={GetCategory}
        renderItem={({item, index}) => (
            <TouchableOpacity style={{ 
                flex: 1
             }}
             key={index}
             onPress={()=>{
                setSelectedCategory(item.name);
                category(item.name);
            }}
             >
                <View style={[styles.container, selectedCategory==item.name&&styles.selectedCategoryContainer]}>
                    <Image
                        source={{ uri: item?.imageUrl }}
                        style={{ 
                            width: 40,
                            height: 40,
                         }}
                    />
                </View>
                <Text style={styles.subtitle}>{item?.name}</Text>
            </TouchableOpacity>
        )}
       />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding:15,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.PRIMARY,
        margin: 5,
    },
    subtitle: {
        textAlign: 'center',
        fontFamily: 'outfit'
    },
    selectedCategoryContainer: {
        backgroundColor: Colors.SECONDARY,
        borderColor: Colors.SECONDARY
    }
})