import { View, Text, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import MarkFav from './MarkFav'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
// import AntDesign from '@expo/vector-icons/AntDesign';

export default function ProductInfo({pet}) {
  // console.log(pet?.imageUrl);

      // const imageUrl = encodeURIComponent(pet?.imageUrl);

  const [image, setImage] = useState(null);
  useEffect(() => {
    
    const fetchArticle = async () => {
      const articleRef = doc(db, 'Products', pet.id);
      const articleSnap = await getDoc(articleRef);

      if (articleSnap.exists()) {
        const articleData = articleSnap.data();
        setImage(articleData.imageUrl);
      }
    }

    fetchArticle();
  }, [])
  
  return (
    <View>
          {image ? (
            <Image
              source={{ uri:image }}
              style={{ 
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15
              }}
            />
          ) : (
            <Image
              source={{ uri:pet?.imageUrl }}
              style={{ 
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15
              }}
            />
          )}



        <View style={{ 
            padding: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
         }}>
            <View>
                <Text style={{ 
                    fontFamily: 'outfit-bold',
                    fontSize: 27
                 }}>{pet?.name}</Text>

                 <Text style={{ 
                    fontFamily: 'outfit',
                    fontSize: 16,
                    color: Colors.GRAY,
                    maxWidth: '90%'
                  }}>{pet?.address}</Text>
            </View>

            {/* <AntDesign name="hearto" size={30} color="black" /> */}
            <MarkFav product = {pet}/>
        </View>
    </View>
  )
}