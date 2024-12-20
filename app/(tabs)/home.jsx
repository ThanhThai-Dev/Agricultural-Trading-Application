import { View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import Category from '../../components/Home/Category'
import VeListByCategory from '../../components/Home/VeListByCategory'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors'
import { Link } from 'expo-router'
import About from '../../components/Home/About'
import Search from '../../components/Home/Search'

export default function Home() {
  return (
    <ScrollView
    style={{ 
      padding: 20,
      marginTop: 20,
      height: '100%',
     }}>
        {/* header  */}
        <Header/>

        {/* Search bar  */}
        <Search/>

        {/* slider  */}
        <Slider/>

        {/* about us  */}
        <About/>

        {/* category and list of vegetable */}
        <VeListByCategory/>
        
        {/* add new vege option  */}
        <Link href={'/add-new-product'}
        style={styles.addNewVeContainer}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.PRIMARY} />
          <Text style={{ 
            fontFamily: 'outfit-medium',
            color: Colors.PRIMARY,
            fontSize: 18,
            textAlign: 'center'
           }}>Thêm sản phẩm mới!</Text>
        </Link>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  addNewVeContainer: { 
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 60,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: 'dashed',
    justifyContent: 'center',
   }
})