import { View, Text, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Category from './Category'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import VeListItem from './VeListItem'

export default function VeListByCategory() {

  const [veList, setVeList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetVeList('Pig');
  }, [])
  

  // su dung de lay tat ca san pham theo danh muc da co 
  const GetVeList=async (category)=>{
    setLoader(true);
    setVeList([]);
    const q=query(collection(db,'Products'), where('category', '==', category));
    const snapshot=await getDocs(q);

    snapshot.forEach(doc=>{
      // console.log(doc.data());
      setVeList(veList=>[...veList, doc.data()]);
    })
    setLoader(false);
  }

  return (
    <View>
      <Category 
        category={(value)=>GetVeList(value)}
      />

    <ScrollView>
      <FlatList
        data={veList}
        style={{ marginTop: 10 }}
        refreshing={loader}
        onRefresh={()=>GetVeList('Pig')}
        renderItem={({item, index}) => (
            <VeListItem pet={item} key={index}/>
        )}
        scrollEnabled={false}
      />
    </ScrollView>

    </View>
  )
}