import { View, Text, Image, StyleSheet, Dimensions, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import {db} from './../../config/FirebaseConfig'
import { FlatList } from 'react-native';
// import Animated, { useSharedValue,
//     withTiming,
//     useAnimatedStyle,Easing } from 'react-native-reanimated';

// const { width } = Dimensions.get('screen').width*0.89;
// const SLIDE_DURATION = 2000; // thời gian chuyển slide (2 giây)



export default function Slider() {

    // const randomWidth = useSharedValue(10);

    // const translateX = useSharedValue(0);
    // const [currentIndex, setCurrentIndex] = useState(0);

    // const config = {
    //     duration: SLIDE_DURATION,
    //     easing: Easing.bezier(0.5, 0.01, 0, 1),
    //   };

    // const style = useAnimatedStyle(() => {
    //     return {
    //       width: withTiming(width, config),
    //     };
    // }); 

    const [sliderList, setSliderList] = useState([]);
    const [loader, setLoader] = useState(false);


    const GetSliders = async() => {
        setLoader(true);
        setSliderList([]);
        const snapshot = await getDocs(collection(db, 'Sliders'));
        snapshot.forEach((doc)=>{
            // console.log(doc.data());
            setSliderList(sliderList=>[...sliderList, doc.data()])
        })
        setLoader(false);
    }

    useEffect(() => {
        GetSliders();
    }, []);

    // const goToNextSlide = () => {
    //     let nextIndex = (currentIndex + 1) % GetSliders().length; // Vòng lại từ đầu nếu hết slide
    //     setCurrentIndex(nextIndex);
    //     translateX.value = withTiming(-nextIndex * width, config);
    //   };
    
    // useEffect(()=>{
    //     GetSliders();
    //     const interval = setInterval(goToNextSlide, SLIDE_DURATION);
    //         return () => clearInterval(interval); // Clear interval khi component unmount
    // }, [currentIndex]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: translateX.value }],
//     };
//     },  []);

  return (
    <View style={styles.styleContainer}>
        <FlatList
            data={sliderList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            refreshing={loader}
            onRefresh={GetSliders}
            renderItem={({item, index}) => (
                <View>
                    <Image
                        source={{ uri: item?.imageUrl }}
                        style={styles?.sliderImage}
                        key={index}
                    />
                </View>
            )}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    sliderImage: {
        width: Dimensions.get('screen').width*0.89,
        height: 170,
        borderRadius: 15,
        marginRight: 15,
    },
    styleContainer: {
        marginTop: 15,

    }
})