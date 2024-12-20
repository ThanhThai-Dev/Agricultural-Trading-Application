import { View, Text, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { createArticle } from '../../Model/Article';
import { useUser } from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';

export default function AddArticleScreen() {

    const navigation = useNavigation();
    const {user} = useUser();

    const userId = user?.primaryEmailAddress?.emailAddress;
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState(
        {
          postCategory: 'Pig',
          userName: user?.fullName,
          userImage: user?.imageUrl
        }
      );
    //   console.log(formData);
    const [uploading, setUploading] = useState(false);


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

      const handleInputChange=(fieldName, fieldValue)=>{
        // console.log(fieldName, fieldValue);
        setFormData(prev => ({
          ...prev,
          [fieldName]: fieldValue
        }))
      }

      const addArticleInfo = async() => {
        try {
            await createArticle(userId, image, formData);
            // console.log("Complete addArticleInfo");
            Alert.alert("Thông báo", "Thêm bài viết mới thành công!");
            navigation.goBack('/article');
        } catch (error) {
            console.log(error, "In addArticleInfo");
        }
      }

      useEffect(() => {
        
        navigation.setOptions({
            headerTitle: 'Thêm bài viết mới'
        });

      GetCategory();
      }, [])
      
    
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Hãy tạo cho bạn một phong cách mới!!!</Text>


      <View style={styles.containerInput}>
          {/* tieu de bai viet  */}
        <TextInput
          placeholder='Tiêu đề bài viết'
          onChangeText={(value) => handleInputChange('postTitle', value)}
          style={styles.inputTextTitle}
        />

          {/* content bai viet  */}
        <TextInput
          placeholder='Nội dung bài viết'
          onChangeText={(value) => handleInputChange('postContent', value)}
          style={styles.inputTextContent}
        />
      </View>

      

            {/* chon danh muc  */}
      <View style={styles.categoryInput}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            handleInputChange('postCategory', itemValue);
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
              {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
              ) : (
                  <Image source={ require('./../../assets/images/placeholder.png') } style={styles.image}/>
              )}
            </TouchableOpacity>
          </View>

      <TouchableOpacity onPress={addArticleInfo} 
      style={styles.btnSubmitForm}>
        <Text style={{ fontFamily: 'outfit-medium', fontSize: 16 }}>Thêm bài viết mới</Text>
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