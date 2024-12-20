import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'
import MarkFav from '../ProductDetails/MarkFav';

export default function VeListItem({pet}) {

    const router = useRouter();
    // console.log(pet);

  return (
    <TouchableOpacity 
    onPress={()=>router.push({
        pathname: `/product-details`,
        params: pet
    })}
    style={{ 
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginBottom: 25
     }}>
        {/* favorite icon product  */}
        <View style={{ 
            position: 'absolute',
            zIndex: 10,
            right: 12,
            top: 10
         }}>
            <MarkFav product={pet} color={'black'}/>
        </View>


         {/* image for item  */}
        <Image
            source={{ uri:pet?.imageUrl }}
            style={{ 
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 10,
                marginBottom: 14
             }}
        />

        <Text style={{ 
            fontFamily: 'outfit-medium',
            fontSize: 22,
         }}>
            {pet?.name}
        </Text>

        <View>
            {/* name and shelfLife   */}
            <View style={{ 
                display:'flex',
                flexDirection:'row',
                justifyContent: 'space-between',
                alignItems: 'center'
             }}>
                <Text style={{ 
                    color: Colors.GRAY,
                    fontFamily: 'outfit',
                    fontSize: 16,
                    color: Colors.PRIMARY,
                    paddingLeft: 5
                }}>
                    {pet?.category}
                </Text>
                {pet?.shelfLife?(<Text style={{ 
                    fontFamily:'outfit',
                    fontSize: 14,
                    backgroundColor: Colors.LIGHT_PRIMARY,
                    borderRadius: 10,
                    paddingHorizontal: 6
                 }}>
                    {pet?.shelfLife}
                </Text>): (<View><Text style={{ 
                    fontFamily:'outfit',
                    fontSize: 14,
                    backgroundColor: Colors.LIGHT_PRIMARY,
                    borderRadius: 10,
                    paddingHorizontal: 6
                 }}>No shelf life</Text></View>)}
                
            </View>

            {/* note infomation */}
            {pet?.note ? (
                <Text
            style={{
                color: Colors.GRAY,
                fontFamily: 'outfit',
                fontSize: 16,
                paddingVertical: 14,
                paddingHorizontal: 8
             }}
             numberOfLines={3}
             >
             - {pet?.note} -
             </Text>
            ) : (<View></View>)}
            
        </View>
    </TouchableOpacity>
  )
}