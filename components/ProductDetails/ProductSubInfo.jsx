import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import ProductSubInfoCard from './ProductSubInfoCard'

export default function ProductSubInfo({pet}) {

    // Hàm định dạng tiền tệ VND
  const formatCurrencyVND = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };


  return (
    <View style={{ 
        paddingHorizontal: 20
     }}>
        <View style={{ 
            display: 'flex',
            flexDirection: 'row',
         }}>
         {/* han su dung cua san pham  */}
            <ProductSubInfoCard 
                icon={require('./../../assets/images/november.png')}
                title={'NSX'}
                value={pet?.dateBegin}
            />

            {/* danh muc san pham  */}
            <ProductSubInfoCard 
                icon={require('./../../assets/images/dateBegin.png')}
                title={'HSD'}
                value={pet?.shelfLife}
            />
        </View>
        
        <View style={{ 
            display: 'flex',
            flexDirection: 'row',
         }}>
         {/* han su dung cua san pham  */}
            <ProductSubInfoCard 
                icon={require('./../../assets/images/category.png')}
                title={'Danh mục'}
                value={pet?.category}
            />

            {/* danh muc san pham  */}
            <ProductSubInfoCard 
                icon={require('./../../assets/images/price.png')}
                title={'Đơn giá'}
                value={formatCurrencyVND(pet?.price)}
            />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    labelInfo: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY
    },
    labelData: {
        fontFamily: 'outfit-medium',
        fontSize: 20
    },
    containerSection: { 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        padding: 10,
        margin: 5,
        borderRadius: 8,
        gap: 5,
        flex: 1
     }
})