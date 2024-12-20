import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import ProductInfo from '../../components/ProductDetails/ProductInfo';
import ProductSubInfo from '../../components/ProductDetails/ProductSubInfo';
import AboutProduct from '../../components/ProductDetails/AboutProduct';
import OwnerInfo from '../../components/ProductDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { addProductToUserCart } from '../../Model/Cart';

export default function ProductDetails() {

    const product = useLocalSearchParams();
    const navigation = useNavigation();
    const {user} = useUser();
    const router = useRouter(); 
    // const [loader, setLoader] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: ''
        });
    }, [])
    

    //use to initiate chat with user
    const InitiateChat=async()=>{
      // setLoader(true)
      const docId1 = user?.primaryEmailAddress?.emailAddress+'_'+product?.email;
      const docId2 = product?.email+'_'+user?.primaryEmailAddress?.emailAddress;

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
              email: product?.email,
              imageUrl: product?.userImage,
              name: product?.userName
            }
          ],

          userIds: [user?.primaryEmailAddress?.emailAddress, product?.email]
        });

        router.push({
          pathname: '/chat',
          params: {id: docId1}
        })
      }
    }

    const addToCart = async() => {
      const userId = user?.primaryEmailAddress?.emailAddress

      await addProductToUserCart(userId, {
        imageUrl: product?.imageUrl,
        name: product?.name,
        price: product?.price,
        productId: product?.id,
        quantity: 1,
      })
    }

  return (
    <View>
      <ScrollView>
        <ProductInfo pet={product}/>
      {/* Product Properties */}
        <ProductSubInfo pet={product}/>
      {/* note  */}
        <AboutProduct pet={product}/>
      {/* owner details  */}
        <TouchableOpacity onPress={InitiateChat}>
          <OwnerInfo pet={product}/>
        </TouchableOpacity>
        
        
        <View style={{ 
          height: 70,
        }}>

        </View>

      </ScrollView>

      {/* adopt me button */}
      <View style={styles?.bottomContainer}>
        <TouchableOpacity
          onPress={InitiateChat} 
          style={styles.adoptBtn}
        >
            <Text style={{ 
              textAlign:'center',
              fontFamily: 'outfit-medium',
              fontSize: 20
             }}>Liên hệ ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnAddCart} onPress={addToCart}>
          <Text style={{ 
              textAlign:'center',
              fontFamily: 'outfit-medium',
              fontSize: 20
             }}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View> 
      
    </View>
  )
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.SECONDARY,
    borderWidth: 1,
    borderTopLeftRadius: 22,
    width: '50%'
  },
  btnAddCart: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderWidth: 1,
    borderTopRightRadius: 22,
    width: '50%',
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})