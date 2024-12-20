import { View, Text, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import shared from '../../Shared/shared'
import { useUser } from '@clerk/clerk-expo'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import VeListItem from '../../components/Home/VeListItem';
import Colors from '../../constants/Colors';

export default function Favorite() {

  const {user} = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favProductList, setFavProductList] = useState([]);
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    user&&GetFavProductIds();
  }, [user])
  
  //Fav Ids
  const GetFavProductIds = async() => {
    setLoader(true);
    const result = await shared.GetFavList(user);
    setFavIds(result?.favorite);
    setLoader(false);

    GetFavProductList(result?.favorite);
  }
  
  //Fetch Related Product List
  const GetFavProductList = async(favId_) => {
    setLoader(true);
    setFavProductList([]);
    const q = query(collection(db, 'Products'), where('id', 'in', favId_));

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      // console.log(doc.data());
      setFavProductList(prev => [...prev, doc.data()]);
    })
    setLoader(false);
  }

  return (
    <View style={{ 
      padding: 20,
      marginTop: 20,
      paddingBottom: '20%'
     }}>
      <Text style={{ 
        fontFamily: 'outfit-medium',
        fontSize: 30
       }}>Favorites</Text>

       <Text style={{ 
        fontFamily: 'outfit',
        fontSize: 16,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.GRAY
        }}>
        ..Đây là tất cả các bài mà bạn đã yêu thích
       </Text>

        <FlatList
          style={{ width: '100%', marginVertical: 20 }}
          data={favProductList}
          onRefresh={GetFavProductIds}
          refreshing={loader}
          renderItem={({item, index}) => (
            <View>
              <VeListItem pet={item} key={index}/>
            </View>
          )}
        />
    </View>
  )
}