import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import Colors from '../../constants/Colors'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { convertToObject } from 'typescript';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddNewProduct() {

    const navigation = useNavigation();
    const [formData, setFormData] = useState(
      {
        category: 'Pig'
      }
    );
    // const [valuePicker, setValuePicker] = useState()
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image, setImage] = useState();
    const [loader, setLoader] = useState(false)

    const {user} = useUser();
    const router = useRouter();

    useEffect(() => {
      navigation.setOptions({
        headerTitle: 'Thêm một sản phẩm mới'
      })

      GetCategory();
    }, [])

    // get catagory from database 
    const GetCategory = async() => {
      setCategoryList([])
      const snapshot = await getDocs(collection(db, 'Category'));
      snapshot.forEach((doc) => {
          // console.log(doc.data());
          setCategoryList(categoryList=>[...categoryList, doc.data()])
      })
    }

    // use to pic image from gallery 
    const imagePicker=async()=>{
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }

    const handleInputChange=(fieldName, fieldValue)=>{
      // console.log(fieldName, fieldValue);
      setFormData(prev => ({
        ...prev,
        [fieldName]: fieldValue
      }))
    }

    const onSubmit = () => {
      // console.log(formData);
      if(Object.keys(formData).length!=8){
        ToastAndroid.show('Please Enter All Details', ToastAndroid.SHORT);
        return ;
      }
      UploadImage(image);
    }


    // use to upload image to firebase storage 
    const UploadImage=async()=>{
      setLoader(true);

      // // lay hinh anh tu bien image cho vao bien resp 
      const resp=await fetch(image);

      // // Chuyển đổi hình ảnh thành blob 
      const blobImage=await resp.blob();

      // // Tạo tham chiếu đến nơi lưu trữ firebase image 
      const linkRef = 'Grocery-app/'+Date.now()+'.jpg';
      // const encodedFilePath = encodeURIComponent(linkRef);
      const storageRef = ref(storage, 'Grocery-app/'+Date.now()+'.jpg');
      // const encodedFilePath = encodeURIComponent(storageRef);

      // Tải ảnh lên firebase storage uploadByte cần 2 biến 'tham chiếu' & 'hình đã chuyển blob'
      uploadBytes(storageRef, blobImage).then((snapshot)=>{
        console.log('File Uploaded')
      }).then(resp=>{ 
        //Lấy Url để truy xuất hình ảnh hàm getDownloadURL cần 1 biến 'biến tham chiếu'
        getDownloadURL(storageRef).then(async(downloadUrl)=>{
          console.log(downloadUrl);
          saveFormData(downloadUrl);
        })
      })

      // try {
      //   // Tải ảnh từ URL thành blob
      //   const resp = await fetch(image);
      //   const blobImage = await resp.blob();
    
      //   // Tạo tham chiếu đến vị trí lưu ảnh trên Firebase
      //   const filePath = `Grocery-app/${Date.now()}.jpg`;
    
      //   // Mã hóa đường dẫn
      //   const encodedFilePath = encodeURIComponent(filePath);
      //   const storageRef = ref(storage, encodedFilePath);
    
      //   // Tải ảnh lên Firebase Storage
      //   const snapshot = await uploadBytes(storageRef, blobImage);
      //   console.log('File Uploaded', snapshot);
    
      //   // Lấy URL để truy xuất hình ảnh
      //   const downloadUrl = await getDownloadURL(storageRef);
      //   console.log('Download URL:', downloadUrl);
    
      //   // Lưu URL hoặc thực hiện hành động khác với URL này
      //   saveFormData(downloadUrl);
    
      // } catch (error) {
      //   console.error("Error uploading or fetching download URL:", error);
      // }


    }

    const saveFormData=async(downloadUrl)=>{
      const docId = Date.now().toString();
      //setDoc tuong ung voi insert trong no sql
      await setDoc(doc(db, 'Products', docId), {
        ...formData,
        imageUrl: downloadUrl,
        userName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        id: docId,
      })
      setLoader(false); //sau khi da add data vao thi tat load
      Alert.alert("Thông báo", "Thêm sản phẩm mới thành công!!!");
      router.replace('/(tabs)/home');
    }
    

  return (
    <ScrollView style={{ 
        padding: 20,
     }}>
      <Text style={{ 
        fontFamily: 'outfit-medium',
        fontSize: 20,
        textAlign: 'center'
       }}>HÃY BẮT ĐẦU THÊM MỘT SẢN PHẨM MỚI</Text>

       {/* Image for product  */}
       <TouchableOpacity 
        onPress={imagePicker}
       >
         {!image? <Image 
            source={ require('./../../assets/images/placeholder.png') }
            style={{ 
              width: 100,
              height: 100,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              margin: 20,
              marginVertical: 30
            }}
          /> : 
          <Image 
            source={{ uri:image }}
            style={{ 
              width: 250,
              height: 250,
              borderRadius: 15,
              margin: 20,
              marginVertical: 30,
            }}
          />}
       </TouchableOpacity>
       
        {/* name  */}
       <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên sản phẩm: </Text>
        <TextInput 
          placeholder='Nhập tên sản phẩm ở đây'
          style={styles.input}
          onChangeText={(value)=>handleInputChange('name', value)}
        />
       </View>
         {/* Shelf Life  */}
       <View style={styles.inputContainer}>
        <Text style={styles.label}>Hạn sử dụng: </Text>
        <TextInput 
          placeholder='Nhập hạn sử dụng ở đây'
          style={styles.input}
          onChangeText={(value)=>handleInputChange('shelfLife', value)}
        />
       </View>

      {/* Day begin  */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ngày sản xuất: </Text>
        <TextInput 
          placeholder='Nhập ngày sản xuất ở đây'
          style={styles.input}
          onChangeText={(value)=>handleInputChange('dateBegin', value)}
        />
       </View>

       {/* Weight  */}
       <View style={styles.inputContainer}>
        <Text style={styles.label}>Trọng lượng: </Text>
        <TextInput
          keyboardType='numeric' 
          placeholder='Nhập trọng lượng sản phẩm ở đây'
          style={styles.input}
          onChangeText={(value)=>handleInputChange('weight', value)}
        />
       </View>

       {/* Price  */}
       <View style={styles.inputContainer}>
        <Text style={styles.label}>Đơn giá sản phẩm: </Text>
        <TextInput
          keyboardType='numeric' 
          placeholder='Nhập đơn giá sản phẩm ở đây'
          style={styles.input}
          onChangeText={(value)=>handleInputChange('price', value)}
        />
       </View>


         {/* address  */}
       <View style={styles.inputContainer}>
        <Text style={styles.label}>Địa chỉ nguồn gốc sản phẩm: </Text>
        <TextInput 
          placeholder='Nhập địa chỉ sản phẩm vào ở đây'
          style={styles.input}
          onChangeText={(value)=>handleInputChange('address', value)}
        />
       </View>

         {/* su dung cho truong gia tri 1 or 2  */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Danh mục sản phẩm: </Text>
        <Picker
          style={styles.input}
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) =>{
            setSelectedCategory(itemValue);
            handleInputChange('category',itemValue)
          }}>

          {categoryList.map((category, index)=>(
            <Picker.Item key={index} label={category.name} value={category.name} />
          ))}

          {/* <Picker.Item label="2" value="2" /> */}
        </Picker>
      </View>
         {/* About */}
       <View style={styles.inputContainer}>
        <Text style={styles.label}>Thông tin về sản phẩm: </Text>
        <TextInput 
          placeholder='Nhập thông tin sản phẩm ở đây'
          style={styles.input}
          numberOfLines={10}
          multiline={true}
          onChangeText={(value)=>handleInputChange('note', value)}
        />
       </View>

       
       {/* Button submit form  */}
       <TouchableOpacity
        style={styles.btnSubmit}
        onPress={onSubmit}
        disabled={loader}
       >
        {loader?<ActivityIndicator size={'large'}/>:
          <Text style={{ 
          fontFamily: 'outfit-medium',
          fontSize: 16,
          textAlign: 'center'
         }}>Thêm vào</Text>
        }
       </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5
  },
  input: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: 'outfit',
    borderWidth: 1
  },
  label: {
    marginVertical: 5,
    fontFamily: 'outfit'
  },
  btnSubmit: {
    padding: 15,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 7,
    marginBottom: 50,
    marginTop: 22,
    borderWidth: 1
  }
})