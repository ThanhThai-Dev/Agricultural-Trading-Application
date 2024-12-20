import { View, Text, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { createArticle, updatedArticle } from '../../Model/Article';
import { useUser } from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';

export default function UpdatedArticle() {

    const navigation = useNavigation();
    const {user} = useUser();
    const data = useLocalSearchParams();

    const userId = user?.primaryEmailAddress?.emailAddress;
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    // const [imageUrl, setImageUrl] = useState(null);
    const [newImage, setNewImage] = useState(null);
      
    

    //   console.log(formData);
    // const [uploading, setUploading] = useState(false);


    const pickerImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if (!result.canceled){
            setImage(result.assets[0].uri);
        }
    };

    const GetCategory = async() => {
        setCategoryList([])
        const snapshot = await getDocs(collection(db, 'Category'));
        snapshot.forEach((doc) => {
            // console.log(doc.data());
            setCategoryList(categoryList=>[...categoryList, doc.data()])
        })
      };

      const updateArticle = async() => {
        const dataNew = {
          newTitle: title,
          newContent: content,
          newCategory: selectedCategory,
        }

        try {
          await updatedArticle(data.id, data.userId, dataNew, newImage, image);

            Alert.alert('Bài viết đã được cập nhật');
        } catch (error) {
          console.log(error);
        }
      }

      useEffect(() => {
        
        navigation.setOptions({
            headerTitle: 'Thêm bài viết mới'
        });

      GetCategory();

      const fetchArticle = async () => {
        const articleRef = doc(db, 'Post', data.id);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
          const articleData = articleSnap.data();
          setTitle(articleData.postTitle);
          setContent(articleData.postContent);
          // setCategory(articleData.postCategory);
          setSelectedCategory(articleData.postCategory);
          setImage(articleData.postImageUrl);
        }
      }

      fetchArticle();
      }, [data.id])
      
    
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Hãy tạo cho bạn một phong cách mới!!!</Text>


      <View style={styles.containerInput}>
          {/* tieu de bai viet  */}
        <TextInput
          placeholder='Tiêu đề bài viết'
          onChangeText={setTitle}
          value={title}
          style={styles.inputTextTitle}
        />

          {/* content bai viet  */}
        <TextInput
          placeholder='Nội dung bài viết'
          // onChangeText={(value) => handleInputChange('postContent', value)}
          onChangeText={setContent}
          value={content}
          style={styles.inputTextContent}
        />
      </View>

      

            {/* chon danh muc  */}
      <View style={styles.categoryInput}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            }}
          style={{ borderWidth: 1, padding: 8 }}
        >
          {categoryList.map((category, index)=>(
            <Picker.Item key={index} label={category.name} value={category.name} />
          ))}
        </Picker>
      </View>

          {/* chon hinh anh  */}
          <View>
            <TouchableOpacity onPress={pickerImage} style={styles.imageContainer}>
              {image && !newImage ? (
                  <Image source={{ uri: image }} style={styles.image} />
              ) : (
                  newImage && <Image source={{ uri: newImage }} style={styles.image}/>
              )}
            </TouchableOpacity>
          </View>

      <TouchableOpacity onPress={updateArticle} 
      style={styles.btnSubmitForm}>
        <Text style={{ fontFamily: 'outfit-medium', fontSize: 16 }}>Cập nhật bài viết</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    padding: 20,
    marginTop: 10,
  },
  containerInput:{
  },
  headerTitle:{
    fontFamily: 'outfit-medium',
    fontSize: 18,
    marginBottom: 22
  },
  inputTextTitle: {
    padding: 10,
    borderLeftWidth: 2,
    borderRightWidth: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 3,
    marginVertical: 12,
    borderRadius: 12,
    textAlign: 'center',
  },
  inputTextContent: {
    padding: 10,
    borderLeftWidth: 2,
    borderRightWidth: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 3,
    marginVertical: 12,
    height: 300,
    textAlign: 'center',
    borderRadius: 12
  },
  categoryInput:{
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 12,
    fontFamily: 'outfit-medium',
  },
  imageContainer:{
    marginVertical: 12,
    borderLeftWidth: 2,
    borderRightWidth: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 3,
    height: 250,
    width: '100%',
  },
  image:{
    resizeMode: 'cover',
    width: '100%',
    height: '100%'
  },
  btnSubmitForm: {
    borderLeftWidth: 2.5,
    borderRightWidth: 1.5,
    borderTopWidth: 1,
    borderBottomWidth: 3.5,
    borderRadius: 15,
    padding: 12,
    marginBottom: 60,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_PRIMARY
  },
})