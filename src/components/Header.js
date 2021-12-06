import AsyncStorage from '@react-native-async-storage/async-storage'
import React,{useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { AuthContext } from './AuthContext'
import Entypo from 'react-native-vector-icons/Entypo';






const Header = () => {
    const { signOut } = React.useContext(AuthContext);
    const[mobile, setMobile]=useState('')
    const [user_id, setUserId]=useState('')
    const getuser= async ()=>{
        const user =await AsyncStorage.getItem('@user')
        const userData=JSON.parse(user)
        setMobile(userData.phone)
        setUserId(userData.id)
       
    }
    useEffect(() => {
       getuser()
    }, [])
    return (
        <View style={styles.header}>
             <View style={styles.userView} >
             <Entypo name="old-mobile" size={24} color="white" />
          <Text style={{fontSize:20, color:'white', fontWeight:"bold"}}>{mobile}</Text>
          </View>
            <TouchableOpacity style={styles.logouButton} onPress={()=>{signOut()}}>
          <Text style={{fontSize:25, color:'white', fontWeight:"bold"}}>Logout</Text>
          </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header:{
        width:"100%",
        height:70, 
        backgroundColor:"red", 
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:5
        

    },
    logouButton:{
        width:120,
        height:"100%",
        justifyContent:"center",
        alignItems:'center',
        borderRadius:5,
        borderWidth:2,
        borderColor:"white"
    },
    userView:{
        width:120,
        height:"100%",
        justifyContent:"center",
        alignItems:'center',
         
    }
})
