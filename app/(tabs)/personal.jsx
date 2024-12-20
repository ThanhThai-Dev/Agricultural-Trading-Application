import { View, Text, Image, TouchableOpacity, Modal, Button, ScrollView, FlatList, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { BackgroundImage } from 'react-native-elements/dist/config';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { router } from 'expo-router';
import { getArticles, getArticlesByUserId } from '../../Model/Article';
import ArticleItem from '../../components/Article/ArticleItem';
import Colors from '../../constants/Colors';
import { updateUser } from '../../Model/User';


export default function personal() {
    const {user} = useUser();
    const userId = user?.primaryEmailAddress?.emailAddress;

    const [userData, setUserData] = useState(null);
    // const [modalVisible, setModalVisible] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [avatarImage, setAvatarImage] = useState(null);
    const [postData, setPostData] = useState([]);

    const [address, setAddress] = useState("");
    const [about, setAbout] = useState("");
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);

    const [loading, setLoading] = useState(false);

    const fetchPostData = async() => {
      setLoading(true);
      const post = await getArticlesByUserId(userId);
      setLoading(false);
      setPostData(post);
    }

    useEffect(() => {
      const fetchUserData = async() => {
        const userRef = doc(db, 'Users', userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            setUserData(docSnap.data());
        } else {
            await setDoc(userRef, {
                userId: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userAvatar: user?.imageUrl,
                about: 'Your Infomation',
                address: 'Your Address',
                userImageBack: '',
            });

            setUserData({ 
                userId: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userAvatar: user?.imageUrl,
                userAbout: 'Your Infomation',
                userAddress: 'Your Address',
                userImageBack: '', 
            });
        }
      };

      fetchUserData();
      fetchPostData();
    }, [userId]);
    // console.log(userData?.userAddress);

    const handleBackgroundImageSelect = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if (!result.canceled){
            setBackgroundImage(result.assets[0].uri);
            setShowUpdateButton(true); // Hiện nút cập nhật
        }
    };

    //xu ly cap nhat anh
    const handleUpdateImageBack  = async() => {
        if(backgroundImage){
            const userRef = doc(db, 'Users', userId);

            const backgroundImageUrl = 'default_background_url'; // Thay thế bằng URL thực sau khi tải lên

            if(backgroundImage){
                const response = await fetch(backgroundImage);
                const blob = await response.blob();
    
                const newImageRef = ref(storage, `articles/personal/background/${userId}/${Date.now()}`);
                await uploadBytes(newImageRef, blob);
    
                updatedImageUrl = await getDownloadURL(newImageRef);
            }


            await setDoc(userRef, { 
                userImageBack: updatedImageUrl 
            }, { merge: true });
            setUserData((prev) => ({ ...prev, userImageBack: updatedImageUrl }));
            setShowUpdateButton(false); // Ẩn nút sau khi cập nhật
            setBackgroundImage(null);
        }
    }

    const handleAvatarSelect = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if (!result.canceled){
            // setBackgroundImage(result.assets[0].uri);
            setAvatarImage(result.assets[0].uri);
            setShowUpdateButton(true); // Hiện nút cập nhật
        }
    };

    //xu ly cap nhat anh
    const handleUpdatedAvatar  = async() => {
        if(avatarImage){
            const userRef = doc(db, 'Users', userId);
            // const postRef = doc(db, 'Post', userId);
            // const email = userId;
            // const productRef = doc(db, 'Products', email);


            // const backgroundImageUrl = 'default_background_url'; // Thay thế bằng URL thực sau khi tải lên

            if(avatarImage){
                const response = await fetch(avatarImage);
                const blob = await response.blob();
    
                const newImageRef = ref(storage, `articles/personal/avatar/${userId}/${Date.now()}`);
                await uploadBytes(newImageRef, blob);
    
                updatedImageUrl = await getDownloadURL(newImageRef);
            }


            await setDoc(userRef, { 
                userAvatar: updatedImageUrl 
            }, { merge: true });

          //   //userImage cap nhat lai tai trang post
          //   await setDoc(postRef, { 
          //       userImage: updatedImageUrl 
          //   }, { merge: true });

          //   //userImage cap nhat lai tai trang product
          //   await setDoc(productRef, { 
          //       userImage: updatedImageUrl 
          // }, { merge: true });

            
            setUserData((prev) => ({ ...prev, userAvatar: updatedImageUrl }));
            setShowUpdateButton(false); // Ẩn nút sau khi cập nhật
            // setBackgroundImage(null);
            setAvatarImage(null);
        }
    }

    // cap nhat thong tin ve dia chi va thong tin them cua nguoi dung 
    const handleUpdateUserAddress = async() => {
      try {
        await updateUser(userId, {address});
        console.log("Cap nhat thong tin dia chi thanh cong!");
        setIsEditingAddress(false);
      } catch (error) {
        console.log(error);
      }
    }

    // cap nhat thong tin ve dia chi va thong tin them cua nguoi dung 
    const handleUpdateUserAbout = async() => {
      try {
        await updateUser(userId, {about});
        console.log("Cap nhat thong tin info thanh cong!");
        setIsEditingAbout(false);
      } catch (error) {
        console.log(error);
      }
    }

    const handleCancelUpdateUser = () => {
      setAbout(about);
      setAddress(address);
      setIsEditingAbout(false);
      setIsEditingAddress(false);
    }

    
  return (
    <View style={{ height: '100%' }}>
      {/* Hình nền */}
      <TouchableOpacity onPress={handleBackgroundImageSelect}>
        <Image 
            source={{ uri: backgroundImage || userData?.userImageBack || 'default_background_url' }} 
            style={{ height: 200, width: '100%' }} 
            />
      </TouchableOpacity>

      {/* Hiển thị nút "Cập nhật" nếu có ảnh nền được chọn */}
      {showUpdateButton && backgroundImage && (
        <Button title="Cập nhật" onPress={handleUpdateImageBack} />
      )}


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
            <TouchableOpacity onPress={handleAvatarSelect}>
                <Image 
                    source={{ uri: avatarImage || userData?.userAvatar || user?.imageUrl }} 
                    style={{ height: 100, width: 100, borderWidth: 3, borderRadius: 99, objectFit: 'cover' }}
                    />
            </TouchableOpacity>

            {/* Hiển thị nút "Cập nhật" nếu có ảnh nền được chọn */}
            {showUpdateButton && avatarImage && (
              <View style={{ marginTop: 8 }}>
                <Button title="Cập nhật" onPress={handleUpdatedAvatar}/>
              </View>
            )}
        </View>

        {/* thong tin ca nhan  */}
        <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 22 }}>{userData?.userName}</Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 14 }}>{userData?.userEmail}</Text>

            {isEditingAddress ? (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputAddress}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Nhập địa chỉ mới"
                />
                <View style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {/* <Button title="Cập nhật" onPress={handleUpdateUserAbout} /> */}
                  <Button title="Cập nhật" onPress={handleUpdateUserAddress} />
                  <Button title="Huy" onPress={handleCancelUpdateUser} />
                </View>
              </View>
            ) : (
            <Text 
              style={{ fontFamily: 'outfit', fontSize: 14 }}
              onPress={() => setIsEditingAddress(true)}
              refreshing={loading}
              // onRefresh={fetchUserData}
            >
              {userData?.address}
            </Text>
            )}
        </View>
      </View>

      <View style={{ marginTop: 24, paddingHorizontal: 8, marginBottom: 18 }}>
      {isEditingAbout ? (
        <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputAddress}
                  value={about}
                  onChangeText={setAbout}
                  placeholder="Nhập thong tin mới"
                />
                <View style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Button title="Cập nhật" onPress={handleUpdateUserAbout} />
                  <Button title="Huy" onPress={handleCancelUpdateUser} />
                </View>
              </View>
      ) : (
        <Text 
          onPress={() => setIsEditingAbout(true)}
        >{userData?.about}</Text>
      )}
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

const styles = StyleSheet.create({
  inputAddress: {
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 10,
    padding: 8,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})