import { View, Text, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import { useUser } from '@clerk/clerk-expo'
import UserItem from '../../components/Inbox/UserItem'
import { useLocalSearchParams } from 'expo-router'

export default function Inbox() {
  const {user} = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);
  const product = useLocalSearchParams();


  useEffect(() => {
    user&&GetUserList();
  }, [user])
  

  // Get user list depend user image
  const GetUserList=async()=>{
    setLoader(true);
    setUserList([]);
    const q=query(collection(db, 'Chat'), where('userIds', 'array-contains', user?.primaryEmailAddress?.emailAddress));
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach(doc=>{
      // console.log(doc.data()); 
      setUserList(prevList=>[...prevList,doc.data()])
    })
    setLoader(false);
  }

  // filter the list of other user in one state 
  const MapOtherUserList=()=>{
    const list=[];
    userList.forEach((record)=>{
      const otherUser=record?.users.filter(item=>item?.email != user?.primaryEmailAddress?.emailAddress)
      // const otherUser=result?.users.filter(item=>item.email!=user?.primaryEmailAddress?.emailAddress);
      const result = {
        docId: record.id,
        ...otherUser[0]
      }
      list.push(result);
    })
    return list;
  }

  // console.log(MapOtherUserList());

  return (
    <View style={{ 
      padding: 20,
      marginTop: 20
     }}>
      <Text style={{ 
        fontFamily: 'outfit-medium',
        fontSize: 30
       }}>Inbox</Text>

      <FlatList
        data={MapOtherUserList()}
        onRefresh={GetUserList}
        refreshing={loader}
        style={{ 
          marginTop: 20
         }}
        renderItem={({item, index})=>(
          <UserItem userInfo={item} key={index}/>
        )}
      />
       
    </View>
  )
}