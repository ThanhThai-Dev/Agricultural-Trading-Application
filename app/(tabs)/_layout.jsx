import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Colors from './../../constants/Colors';

// const TabIcon = ({icon, color, name, focused}) => {
//     return (
//       <View>
//         <Image
//           source={icon}
//           resizeMode='contain'
//           tintColor={color}
//           className={`${focused ? 'w-7 h-7' : 'w-6 h-6'}`}
//         />
//         <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
//           {name}
//         </Text>
//       </View>
//     )
//   }

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{ 
            tabBarActiveTintColor: Colors.PRIMARY,
         }}
    >
        <Tabs.Screen
            name='home'
            options={{ 
                title: "Trang Chính",
                headerShown: false,
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="home-assistant" size={30} color={color} />
             }}
        />

        <Tabs.Screen
            name='favorite'
            options={{ 
                title: "Yêu thích",
                headerShown: false,
                tabBarIcon: ({color}) => <FontAwesome6 name="heart-circle-check" size={24} color={color} />
             }}
        />

        <Tabs.Screen
            name='article'
            options={{ 
                title: "Khám phá",
                headerShown: false,
                tabBarIcon: ({color}) => <Ionicons name="earth-outline" size={30} color={color} />
             }}
        />

        <Tabs.Screen
            name='cart'
            options={{ 
                title: "Giỏ hàng",
                headerShown: false,
                tabBarIcon: ({color}) => <FontAwesome name="opencart" size={30} color={color} />
             }}
        />

        <Tabs.Screen
            name='personal'
            options={{ 
                title: "Cá nhân",
                headerShown: false,
                tabBarIcon: ({color}) => <FontAwesome5 name="pager" size={24} color={color} />
             }}
        />

        <Tabs.Screen
            name='inbox'
            options={{ 
                title: "Tin nhắn",
                headerShown: false,
                tabBarIcon: ({color}) => <Ionicons name="chatbox-ellipses" size={24} color={color} />
             }}
        />

        <Tabs.Screen
            name='profile'
            options={{ 
                title: "Thông tin",
                headerShown: false,
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="human-greeting-variant" size={30} color={color} />
             }}
        />

        
    </Tabs>
  )
}