import { useLocalSearchParams, useNavigation } from 'expo-router'
import { View, Text, Image, TouchableOpacity, Modal, Button, ScrollView, FlatList, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { router } from 'expo-router';
import { getArticles, getArticlesByUserId } from '../../Model/Article';
import ArticleItem from '../../components/Article/ArticleItem';
import Colors from '../../constants/Colors';

export default function OtherInfoUser() {
    const data = useLocalSearchParams();
    // console.log(data);
    const navigation = useNavigation();

    const [postData, setPostData] = useState([]);

    const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const fetchPostData = async() => {
    setLoading(true);
    const post = await getArticlesByUserId(data?.userId);
    setLoading(false);
    setPostData(post);
  }

  useEffect(() => {

    navigation.setOptions({
      headerTitle: 'Trang cá nhân người dùng.'
    })
    
    const fetchArticle = async () => {
      const articleRef = doc(db, 'Users', data?.userId);
      const articleSnap = await getDoc(articleRef);
  
      if (articleSnap.exists()) {
        const articleData = articleSnap.data();
        setImage(articleData.userImageBack);
        setAvatar(articleData.userAvatar);
      }
    }
    fetchArticle();
    fetchPostData();
  }, [data?.userId]);

  return (
    <View style={{ height: '100%' }}>
      {/* Hình nền */}
      <TouchableOpacity>
      {image ? (
            <Image
              source={{ uri:image }}
              style={{ 
                height: 200, width: '100%'
              }}
            />
          ) : (
            <Image
              source={{ uri:data?.userImageBack }}
              style={{ 
                height: 200, width: '100%'
              }}
            />
          )}
        {/* <Image 
            source={{ uri: data?.userImageBack || image }} 
            style={{ height: 200, width: '100%' }} 
            /> */}
      </TouchableOpacity>


      <View style={{ 
        paddingHorizontal: 12,
        marginTop: 22, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        }}>
      {/* hinh anh va chuc nang  */}
        <View>
          {/* Ảnh đại diện */}
            {/* Hình nền */}
            <TouchableOpacity>
            {avatar ? (
                <Image 
                    source={{ uri: avatar }} 
                    style={{ height: 100, width: 100, borderWidth: 3, borderRadius: 99, objectFit: 'cover' }}
                    />
              ) : (
                <Image 
                    source={'https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg'} 
                    style={{ height: 100, width: 100, borderWidth: 3, borderRadius: 99, objectFit: 'cover' }}
                    />
              )}
            </TouchableOpacity>
        </View>

        {/* thong tin ca nhan  */}
        <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 22 }}>{data?.userName}</Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 14 }}>{data?.userEmail}</Text>

            <Text 
              style={{ fontFamily: 'outfit', fontSize: 14 }}
            >
              {data?.address}
            </Text>
        </View>
      </View>

      <View style={{ marginTop: 24, paddingHorizontal: 8, marginBottom: 18 }}>
      
        <Text 
        >{data?.about}</Text>
      </View>

      {/* flatList thong tin cac bai post da dang truoc do  */}
      <FlatList
          data={postData}
          style={{ 
            height: '80%', 
            padding: 20,
            borderTopWidth: 1,
            backgroundColor: Colors.GRAY
          }}
          onRefresh={fetchPostData}
          refreshing={loading}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <ArticleItem item={item} key={index}/>
          )}
        />
    </View>
  )
}