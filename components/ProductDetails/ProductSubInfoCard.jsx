import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'

export default function ProductSubInfoCard({icon, title, value}) {
  return (
    <View style={styles.containerSection}>
        <Image source={icon}
            style={{ width: 30, height: 30 }}
        />
        <View style={styles.containerSection2}>
            <Text style={styles.labelInfo}>{title}</Text>
            <Text style={styles.labelData}>{value}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    labelInfo: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY
    },
    labelData: {
        fontFamily: 'outfit-medium',
        fontSize: 16
    },
    containerSection: { 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        padding: 7,
        margin: 5,
        borderRadius: 8,
        gap: 10,
        flex: 1
     },
     containerSection2:{
        flex: 1
     }
})