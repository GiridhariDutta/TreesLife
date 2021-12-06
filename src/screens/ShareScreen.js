// import React, {useState ,useEffect}from 'react'
// import { StyleSheet, Text, View ,Button,Image,ImageBackground ,TouchableOpacity,ScrollView } from 'react-native'
// import ImagePicker from 'react-native-image-picker'
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useIsFocused } from '@react-navigation/native';
// import shortid from 'shortid'
// import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
// import { API } from '../components/Api';
// const ShareScreen = () => {
//   const [image, setImage] = useState(null)
//   const [listOfSeasons, setListOfSeasons] = useState([])
//   const isFocused = useIsFocused()

//   const options = {quality: 0.9, includeBase64: false,mediaType:'photo'}
//   const pickImageOne = async () => {

//     ImagePicker.showImagePicker(options,(response) => {
//         console.log('Response = ', response)

//         if (response.didCancel) {
//             console.log('User cancelled image picker');
//         } else if (response.error) {
//             console.log('ImagePicker Error: ', response.error);
//         } else if (response.customButton) {
//             console.log('User tapped custom button: ', response.customButton);
//         } else {
//            // console.log(response.fileName, 'hh', response.path, response.type)

//             setImage(response)
//         }
//     })
// };
// const pickImage = async () => {

//     ImagePicker.showImagePicker(options,(response) => {
//         console.log('Response = ', response)

//         if (response.didCancel) {
//             console.log('User cancelled image picker');
//         } else if (response.error) {
//             console.log('ImagePicker Error: ', response.error);
//         } else if (response.customButton) {
//             console.log('User tapped custom button: ', response.customButton);
//         } else {
//             console.log(response.fileName, 'hh', response.path, response.type)

//            addToList(response.uri,response.fileName,response.type)
//         }
//     })
// };
// const addToList = async (item1,item2,item3) => {
//   console.log(item1,'item1',item2,'item2',item3,)
//   try {
//       const seasonToAdd = {
//         id:shortid.generate(),
//           imguri:item1,
//             imgfilename:item2,
//             imgtype:item3
//       }
//       const storedValue = await AsyncStorage.getItem('@season_list')
//       const prevList = await JSON.parse(storedValue)
//       if (!prevList) {
//           const newList = [seasonToAdd]

//           await AsyncStorage.setItem('@season_list', JSON.stringify(newList))
//           getList()
//       } else {
//           prevList.push(seasonToAdd)
//           await AsyncStorage.setItem('@season_list', JSON.stringify(prevList))
//           getList()
//       }

//   } catch (error) {
//       console.log(error)
//   }
// }

// const getList = async () => {

//   const storedValue = await AsyncStorage.getItem('@season_list');
//   if (!storedValue) {
//       setListOfSeasons([])
//   }
//   const list = JSON.parse(storedValue)
//   setListOfSeasons(list)

// }
// const removAll=async()=>{
//     await AsyncStorage.removeItem('@season_list')
//     getList()
// }
// const deleteSeason = async (id) => {
//     const newList = await listOfSeasons.filter((list) => list.id !== id)
//     await AsyncStorage.setItem('@season_list', JSON.stringify(newList));
//     setListOfSeasons(newList)
// }
// const save = async () => {
//     let formData = new FormData();
//     const user=  JSON.parse(await AsyncStorage.getItem("@user"))
//     const storedValue = JSON.parse( await AsyncStorage.getItem('@season_list'));
//     storedValue.map((item, i)=>{
//       //  formData.append("clipings[]",{
//       //     uri:item.imguri,
//       //     name:item.imgfilename,
//       //     type:item.imgtype
//       // })
//       const imagdata={
//           uri:item.imguri,
//           name:item.imgfilename,
//           type:item.imgtype
//       }
//       formData.append('files[]', imagdata)
//   })
//   //console.log(formData)
//         let localUri = image.uri;
//         let filename = image.fileName;
//         let type = image.type;
//         formData.append('image', { uri: localUri, name: filename, type });
//         // formData.append('image', { uri: image});
//         formData.append('user_id', 19);
//         formData.append('name', "cat");
//         formData.append('address', "address");
//         formData.append('lat', 24.0977);
//         formData.append('lon', 88.2578);
//         formData.append('service_id', 5);
//         formData.append('mobile', 9874563210);
//         formData.append('description', "description");
//         formData.append('open_time', "06:16:00");
//         formData.append('close_time', "17:15:00");
//         formData.append('days', "1,2,3,4");
//         formData.append('is_trend', 1);
//         formData.append('slider_status', 1);

//         return await fetch(`${API}/vendors`, {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'content-type': 'multipart/form-data',
//                 'Authorization': `Bearer ${user._token}`
//             },
//         }).then(res => {
//             return res.json()
//         }).then(data => {
//            console.log(data,'dar')

//         }).catch(err => console.log(err));

// }

// useEffect(() => {
// //   setTimeout(() => {

// //   }, 1000);

// //   console.log(listOfSeasons.length)
// getList()
// }, [isFocused])

//   return (

//     <View>
//      <Button title="MULTI IMAGE" onPress={pickImage}/>
//       <Text>ShareScreen</Text>
//       <View style={{ width:"100%", height:65, justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
//       {listOfSeasons && listOfSeasons.length ==0 ?(null):(
//         <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
//       {listOfSeasons && listOfSeasons.map((item, i)=>{
//         return(

//               <View  key={i} style={{width:65, height:65 ,borderColor:"black", backgroundColor:"white", opacity:.7, borderWidth:2, marginHorizontal:3}}>
//           <ImageBackground
//             source={{uri: item.imguri}}
//             style={{width:"100%", height:"100%"}}
//             resizeMode="cover"
//             >
//            <TouchableOpacity onPress={()=>deleteSeason(item.id)} style={{width:"100%",
//                                    height:"100%", justifyContent:"center",alignItems:"center"}}>
//               <MaterialIcons name="delete-outline" size={24} color="red" />
//             </TouchableOpacity>
//         </ImageBackground>
//         </View>

//         )
//       })}
//        </ScrollView>) }
//       </View>
//       <Button title="REMOVE"  onPress={removAll}/>
//       <Button title="ONE IMAGE"  onPress={pickImageOne}/>
//       <Button title="save"  onPress={save}/>
//     </View>
//   )
// }

// export default ShareScreen

// const styles = StyleSheet.create({})

import React, {useEffect} from 'react';
import {
  Share,
  View,
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Heading} from 'native-base';
import {flex, justifyContent} from 'styled-system';

const ShareScreen = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'http://artcart.go.com/',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View style={{width: 200, height: 200, marginBottom: 20}}>
        <Image
          style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          source={require('../../src/images/logo.png')}
        />
      </View>
      <TouchableOpacity
        onPress={onShare}
        style={{
          width: 150,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#99cc66',
          borderRadius: 15,
        }}>
        <Heading size="md" style={{color: 'white'}}>
          Share It
        </Heading>
      </TouchableOpacity>
    </View>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({});
