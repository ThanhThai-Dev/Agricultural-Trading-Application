import { View, Text, FlatList, Image, Button, StyleSheet, Modal, Alert, Touchable, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { deleteArticle, getArticles } from '../../Model/Article';
import Colors from '../../constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { addLikeToArticle } from '../../Model/Article';
import { TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import Entypo from '@expo/vector-icons/Entypo';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';


export default function ArticleItem({ item }) {
    const [articleData, setArticleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress;  
  const router = useRouter(); 
  const navigation = useNavigation();

    const [visible, setVisible] = useState(false);
    const buttonRef = useRef(null);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

  // const fetchArticleData = async() => {
  //   setLoading(true);
  //   const data = await getArticles();
  //   // console.log(data);
  //   setLoading(false);
  //   setArticleData(data);
  // }

  const [userData, setUserData] = useState(null);

  const fetchUserDataExists = async() => {
    const userRef = doc(db, 'Users', item?.userId);
    const docSnap = await getDoc(userRef);

    setUserData(docSnap.data());
  };

//   console.log(fetchArticleData);

//use to initiate chat with user
const InitiateChat=async(article)=>{
  // setLoader(true)
  const docId1 = user?.primaryEmailAddress?.emailAddress+'_'+article?.userId;
  const docId2 = article?.userId+'_'+user?.primaryEmailAddress?.emailAddress;

  const q=query(collection(db, 'Chat'),where('id', 'in', [docId1, docId2]));

  const querySnapShot = await getDocs(q);
  querySnapShot.forEach(doc=>{
    router.push({
      pathname: '/chat',
      params: {id: doc.id}
    })
    // console.log(doc.data());
  })

  if(querySnapShot.docs?.length==0){
    await setDoc(doc(db, 'Chat', docId1), {
      id: docId1,
      users: [
        {
          email: user?.primaryEmailAddress?.emailAddress,
          imageUrl: user?.imageUrl,
          name: user?.fullName
        },
        {
          email: article?.userId,
          imageUrl: article?.userImage,
          name: article?.userName
        }
      ],

      userIds: [user?.primaryEmailAddress?.emailAddress, article?.userId]
    });

    router.push({
      pathname: '/chat',
      params: {id: docId1}
    })
  }
}

// const getUserId = (idUser) => {
//   console.log("ID: ", idUser);
// }

  useEffect(() => {
    fetchUserDataExists();
  }, [userId]);


  const addNewLike = async(postIdItem) => {
    try {
        await addLikeToArticle(postIdItem.id, userId);
        setLoading(true);
        console.log("Complete");
    } catch (error) {
        console.log(error);
    }finally{
        setLoading(false);
    }
    // {postIdItem? console.log(articleData) : null;}
    // console.log(postIdItem, userId);
}

  // const addNewArticle = async() => {
  //   router.push('add-article');
  // }

  const navigateToDetail = (data) => {
    router.push({
      pathname: 'article-details',
      params: data
    });
  }

  const deleteHandle = async(postId, imageUrl) => {
    try {
      await deleteArticle(postId, imageUrl);
      // console.log("complete delete");
      Alert.alert("Thông báo xóa bài viết thành công!!!");
    //   router.push('article');
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  const navigationToUserInfo = () => {
    router.push({
      pathname: 'other-Info-user-post',
      params: userData
    })
  }
  return (
    // <ArticleItem data={item} key={index}/>
    <TouchableOpacity 
    style={styles.containerItem}
    >

        {/* headerItem  */}
        <View style={{ 
          padding: 12, 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 12, 
          justifyContent: 'space-between' 
          }}>
            <TouchableOpacity 
            style={{ display: 'flex', flexDirection: 'row', gap: 12}}
            onPress={() => navigationToUserInfo()}
            >
              <Image source={{ uri: item?.userImage }} style={{ width: 45, height: 45, borderWidth: 1, borderRadius: 99 }}/>
              <View>
                  <Text style={{ fontFamily: 'outfit-medium', fontSize: 16 }}>{item?.userName}</Text>
                  <Text style={{ fontFamily: 'outfit', fontSize: 12, color: Colors.GRAY }}>Ngày tạo: {item?.postCreatedAt}</Text>
              </View>
            </TouchableOpacity>

            <View>
            {item?.userId === userId ? (
              <View>
                <TouchableOpacity ref={buttonRef} onPress={openMenu}>
                  <Entypo name="dots-three-vertical" size={20} color="black" />
                </TouchableOpacity> 
                <Modal
                  visible={visible}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={closeMenu}
                >
                  <TouchableOpacity style={styles.overlay} onPress={closeMenu}>
                    <View style={styles.menuContainer}>
                      <TouchableOpacity onPress={()=>deleteHandle(item.id, item.postImageUrl)}>
                        <Text style={styles.menuItem}>Xóa bài viết</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigateToDetail(item)}>
                        <Text style={styles.menuItem}>Cập nhật bài viết</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            ) : (
              <View></View>
            )}
            </View>
        </View>



        {/* content and title post  */}
        <View style={{ padding: 12, marginVertical: 10, gap: 22 }}>
            <Text style={{ fontFamily: 'outfit', fontSize: 14, fontWeight: 'bold' }}>{item.postTitle}</Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 12 }}>{item.postContent}</Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 12, marginTop: 12 }}>Thuộc danh mục: {item.postCategory}</Text>
        </View>

        {/* image post  */}
        <Image source={{ uri: item?.postImageUrl }} style={{ width: '100%', height: 200, resizeMode: 'cover' }}/>
        
        {/* view and likke post  */}
        <View style={{ 
            padding: 12, 
            gap: 22, 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginTop: 10,
            alignItems: 'center',
            }}>
            {item?.likeBy?.includes(userId) ? (
                <TouchableOpacity onPress={() => addNewLike(item)}>
                    <Text style={{ fontFamily: 'outfit', fontSize: 16, color: Colors.RED }}>
                        <AntDesign name="like1" size={18} color={Colors.RED} /> {item?.likes}</Text>
                        {/* <AntDesign name="like1" size={16} color="black" /> */}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => addNewLike(item)}>
                    <Text style={{ fontFamily: 'outfit', fontSize: 16, color: Colors.GRAY }}>
                        <AntDesign name="like2" size={18} color="black" /> {item?.likes}</Text>
                </TouchableOpacity>
            )}

            <Text style={{ fontFamily: 'outfit', fontSize: 12, color: Colors.GRAY }}>
                <FontAwesome name="eye" size={12} color={Colors.GRAY} /> {item?.views}
            </Text>
        </View>

        
          <ScrollView style={{ height: 200, borderTopWidth: 1, padding: 12 }}>
          {/* comment 1 */}
          <View style={{ borderBottomWidth: 1, borderTopWidth: 1, marginTop: 8, padding: 2 }}>
            {/* info basic of user  */}
            <View style={{ display:'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 12 }}>
              <View>
                <Image
                  source={{ uri:'https://i.pinimg.com/736x/60/59/58/605958597a3f9f2409e16eed098d382b.jpg' }}
                  style={{ height: 50, width: 50, borderRadius: 99 }}
                />
              </View>
              <View>
                <Text style={{ fontFamily: 'outfit-medium' }}>Thanh Thai Bui</Text>
                <Text style={{ fontFamily: 'outfit', fontSize: 12, color: Colors.GRAY }}>Ngày tạo: 24/12/2024</Text>
              </View>
            </View>

            {/* comment of user  */}
            <View>
              <Text style={{ fontFamily: 'outfit', fontSize: 14, marginTop: 14 }}>
                Sản phẩm này như thế nào?
              </Text>
            </View>
          </View>
          {/* comment 2 */}
          <View style={{ borderBottomWidth: 1, borderTopWidth: 1, marginTop: 8, padding: 2 }}>
            {/* info basic of user  */}
            <View style={{ display:'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 12 }}>
              <View>
                <Image
                  source={{ uri:'https://i.pinimg.com/474x/d6/37/77/d63777bb20e1c99e82c144a739aedeb6.jpg' }}
                  style={{ height: 50, width: 50, borderRadius: 99 }}
                />
              </View>
              <View>
                <Text style={{ fontFamily: 'outfit-medium' }}>Phuong Quynh Tran</Text>
                <Text style={{ fontFamily: 'outfit', fontSize: 12, color: Colors.GRAY }}>Ngày tạo: 22/12/2024</Text>
              </View>
            </View>

            {/* comment of user  */}
            <View>
              <Text style={{ fontFamily: 'outfit', fontSize: 14, marginTop: 14 }}>
                Sản phẩm rất tốt 10đ
              </Text>
            </View>
          </View>
          </ScrollView>
        

        {/* button handle submit  */}
        {/* <Button title='Delete' onPress={() => deleteHandle(item.id, item.postImageUrl)}/> */}
        {item?.userId !== userId ? (
          <TouchableOpacity style={styles.btnContact} onPress={() => InitiateChat(item)}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 16 }}>Liên hệ ngay</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}

        
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    containerItem: {
        borderWidth: 1,
        marginBottom: 22,
        marginTop: 12,
        backgroundColor: Colors.WHITE,
        borderRadius: 10
    },
    btnContact: {
      borderTopWidth: 1,
      padding: 12,
      alignItems: 'center',
      backgroundColor: Colors.SECONDARY,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10
    },
    overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    menuItem: {
      paddingVertical: 8,
      fontSize: 16,
    },
})