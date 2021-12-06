import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import { API } from '../components/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressDialog } from 'react-native-simple-dialogs';

const AllServicces = ({ navigation }) => {
   
    const [item, setItem] = useState([])
    const [loding, setLoding] = useState(true)
    const allservices = async () => {
        const user = JSON.parse(await AsyncStorage.getItem("@user"))
        fetch(`${API}/services`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user._token}`
            }
        })
            .then((res) => {
                return res.json()
            })
            .then((result) => {
                if (result.data) {
                    setLoding(false)
                    setItem(result.data)
                } else {
                    setLoding(false)
                    alert('No Data Found')
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        allservices()
    }, [])
    return (
        <>

            <View style={styles.mainWrapper}>
                <StatusBar hidden={true} />
                {/* ====header== */}
                <View  style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <AntDesign name="left" size={28} color="black" />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 3, fontSize: 18, fontWeight: "bold" }}>
                        What are you <Text style={{ color: "red" }}>Offering
                        </Text></Text>
                </View>
                {/* ====header== */}
                {/* ====viewAll== */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.serviceWrapper}>
                        {item && item.map((item, i) => {
                            return (
                                <TouchableOpacity key={i} style={{ width: 90, height: 120, marginVertical: 7 }}
                                    onPress={() => navigation.navigate('SingleService', { 'id': item.ID })}>
                                    <View style={{
                                        width: "100%", height: "70%", borderRadius: 5, borderWidth: 1,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <Image source={{ uri: `API/${item.PATH}/${item.IMAGE}` }}
                                            style={{ width: "60%", height: '60%', resizeMode: 'cover' }}
                                        />
                                    </View>
                                    <View style={{
                                        width: "100%", height: "30%", justifyContent: 'center', flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        alignItems: 'center'
                                    }}>
                                        <Text >{item.NAME}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        <ProgressDialog
                            visible={loding}
                            title="Loding Data"
                            message="Please, wait..."
                            titleStyle={{ color: "red", textAlign: 'center' }}
                            messageStyle={{ color: "green", textAlign: "center" }}
                            contentStyle={{ alignItems: "center" }}
                            dialogStyle={{ borderRadius: 10 }}
                            activityIndicatorColor="blue"
                            activityIndicatorSize="large"
                        />



                    </View>
                    {/* ====viewAll== */}
                </ScrollView>
            </View>
        </>
    )
}

export default AllServicces

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 50,
        backgroundColor: "white",
        alignItems: "center",
        paddingLeft: 10,
        flexDirection: "row",
        marginVertical: 20
    },
    mainWrapper: {
        width: "100%",
        height: "100%",
        backgroundColor: "white"
    },
    serviesIMage: {
        width: '70%',
        height: '70%',
        resizeMode: "cover"
    },
    imageView: {
        width: 100,
        height: 130,


    },
    imageViewInner: {
        width: 120,
        height: 100,
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        justifyContent: "center",
        alignItems: "center"

    },
    textView: {
        height: 50,
        width: '100%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: "center"
    },
    serviceWrapper: {
        width: "100%",
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 5,

    }
})
