import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import shared from '../../Shared/shared';
import { useUser } from '@clerk/clerk-expo';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function MarkFav({product, color='black'}) {

    const {user} = useUser();
    const [favList, setFavList] = useState();

    useEffect(() => {
        user&&GetFav()
    
    }, [user])


    const GetFav = async() => {
        const result = await shared.GetFavList(user);
        // console.log(result);
        setFavList(result?.favorite ? result?.favorite : []);
    }
    

    const AddToFav = async() => {
        const favResult = favList;
        favResult.push(product?.id);

        await shared.UpdateFav(user, favResult);
        Alert.alert("Thành công", "Bạn đã thêm sản phẩm này vào danh sách yêu thích");
        GetFav(); 
    }

    const removeFromFav = async() => {
        const favResult = favList.filter(item=>item!=product.id);
        await shared.UpdateFav(user, favResult);
        Alert.alert("Thành công", "Bạn đã xóa sản phẩm này khỏi danh sách yêu thích");
        GetFav();
    }

  return (
    <View>
        {favList?.includes(product.id)? 
        <TouchableOpacity onPress={removeFromFav}>
            {/* <AntDesign name="hearto" size={30} color="red" /> */}
            <AntDesign name="heart" size={30} color="red" />
        </TouchableOpacity> :
        <TouchableOpacity onPress={() => AddToFav()}>
            <AntDesign name="hearto" size={30} color={color} />
        </TouchableOpacity>
        }
        
    </View>
    
  )
}