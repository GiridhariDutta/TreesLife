import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { useIsFocused } from '@react-navigation/native';
import { Spinner } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocatioText = (props) => {
    //console.log(props)
    const isFocused = useIsFocused();
    const [locationName, setLocationName] = useState(true)
    const [spinnerlodding, setspinnerlodding] = useState(true)

    const getAddress = async () => {
        const address = JSON.parse(await AsyncStorage.getItem('@address'))
        const addResss = address.address.split(",")
        //console.log(addResss,'add')
        if (address) {
            setspinnerlodding(false)
            setLocationName(`${addResss[0]},${addResss[1].substr(0, 10)}..`)
            // console.log(address)
        }
    }
    useEffect(() => {
        getAddress()
    }, [isFocused])

    
    return (<>

        <View style={{ ...styles.locationView, height: props.height, }}>
        <TouchableOpacity
                     onPress={()=>props.navigation.navigate('Profile')}
                    style={{width:"100%", flexDirection:"row",alignItems:'center'}}>
                <Entypo name="location-pin" size={32} color="white" />
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>{spinnerlodding ? (<Spinner color="white" size="sm" />) : (`${locationName}`)}</Text>
            </TouchableOpacity>
        </View>
    </>
    )
}

export default LocatioText

const styles = StyleSheet.create({
    locationView: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "flex-end",

        paddingBottom: 10
    },
})
