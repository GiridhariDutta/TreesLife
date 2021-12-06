import React,{useEffect}from 'react'
import { StyleSheet, Text, View ,Image} from 'react-native'

const Home = ({navigation}) => {
    useEffect(() => {
       setTimeout(() => {
           navigation.navigate('OtpSend')
       }, 10000);
    }, [])
    return (
        <>
        <View style={styles.wraper}>
            <View style={styles.logo}>
            <Image style={styles.logoImage}
                        source={require('../../src/images/logo.png')}/>
            </View>
        </View>
        </>
    )
}

export default Home

const styles = StyleSheet.create({
    wraper:{
        flex:1,
        backgroundColor:"white",
        justifyContent:'center',
        alignItems:'center'
    },
    logo:{
        width:300, 
        height:300,
        
    },
    logoImage:{
        width:"100%",
        height:"100%",
        resizeMode:"cover"

    }

})
