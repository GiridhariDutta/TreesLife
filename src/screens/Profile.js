import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';

import {
  useToast,
  Box,
  Heading,
  FormControl,
  Button,
  Input,
  TextArea,
  HStack,
  Stack,
} from 'native-base';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ProgressDialog} from 'react-native-simple-dialogs';

import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API, APIImage} from '../components/Api';
import {useIsFocused} from '@react-navigation/native';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const Profile = ({navigation}) => {
  const isFocused = useIsFocused();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [latt, setLat] = useState('');
  const [longg, setLong] = useState('');
  const [lodding, setLodding] = useState(false);
  const [getemail, setGetEmail] = useState('');
  const [mobile, setmobile] = useState('');
  const [getAddress, setGetAddress] = useState('');
  const [getname, setGetName] = useState('');
  const [image, setImage] = useState('');
  const [path, setPath] = useState('');
  const options = {
    title: ' Choose Image ',
    takePhotoButtonTitle: 'From camera',
    ChooseFromLibraryButtonTitle: 'From Library',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const toast = useToast();
  const alertTossata = (msg, color) => {
    return toast.show({
      duration: 3000,

      render: () => {
        return (
          <Box
            style={{
              height: 50,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: color,
            }}>
            <Text style={{color: 'white', fontSize: 20}}>{msg}</Text>
          </Box>
        );
      },
    });
  };

  const getAddressDetails = () => {
    setLodding(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        // console.log(location,'latitude"');
        setLat(location.latitude);
        setLong(location.longitude);
        //  console.log(lati,long)
        Geocoder.init('AIzaSyDGt77-gotuNZ4hFz6DkWBv4N0XFW3WJ6Q'); // use a valid API key

        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            var getloc = json.results[0].formatted_address;
            var loacation = getloc.split(',');
            //console.log(loacation[1])
            setLodding(false);
            setAddress(getloc);
          })
          .catch(error => console.warn(error));
      })
      .catch(error => {
        const {code, message} = error;
        console.log(code, message);
      });
  };

  const save = async () => {
    //console.log(name, email, address)
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    //console.log(user)

    if (name == '' || email == '' || address == '') {
      alertTossata('All Field Required', 'red');
    } else {
      setLodding(true);
      const dataOne = {
        name: name,
        address: address,
        latitude: latt,
        longitude: longg,
        email: email,
      };
      fetch(`${API}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user._token}`,
        },
        body: JSON.stringify(dataOne),
      })
        .then(res => {
          return res.json();
        })
        .then(async result => {
          // console.log(result,'pro')
          if (result.success == true) {
            setLodding(false);
            await AsyncStorage.removeItem('@address');
            await AsyncStorage.setItem('@address', JSON.stringify(result.data));
            alertTossata('Profile Updated', 'red');
            setName('');
            setEmail('');
            setAddress('');
            setLat();
            setLong();
            getUser();
          } else {
            alertTossata('Profile Not Updated', 'red');
            setLodding(false);
          }
        })
        .catch(err => console.log(err));
    }
  };
  const getUser = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    //console.log(user.id)
    fetch(`${API}/users/${user.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user._token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        //console.log(result, 'pro');
        if (result.success == true) {
          setLodding(false);
          setGetEmail(result.data.email);
          setmobile(result.data.phone);
          setGetAddress(result.data.address);
          setGetName(result.data.name);
          setImage(result.data.img);
          setPath(result.data.path);
        } else {
          setLodding(false);
          alertTossata('All Field Required', 'red');
        }
      })

      .catch(err => console.log(err));
  };

  const pickImageOne = async () => {
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //  // console.log(response.fileName, 'hh', response.path, response.type)

        // setImage(response)
        //  console.log(response.uri,response.fileName,response.type)
        //console.log(response)
        updateProfilePick(response);
      }
    });
  };
  const updateProfilePick = async image => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    let localUri = image.uri;
    let filename = image.fileName;
    let type = image.type;
    let formData = new FormData();
    setLodding(true);
    formData.append('img', {uri: localUri, name: filename, type});
    return await fetch(`${API}/user/photo/${user.id}`, {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${user._token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(async result => {
        //console.log(result)
        if (result.success == true) {
          //setLodding(false)
          alertTossata('Updated Successfully', 'red');

          getUser();
        } else {
          setLodding(false);
          alertTossata('Not Updated', 'red');
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    setLodding(true);
    getUser();
  }, []);
  return (
    <>
      <View style={styles.mainWrapper}>
        <StatusBar hidden={true} />
        {/* ====header== */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={28} color="black" />
          </TouchableOpacity>
          <Text style={{marginLeft: 3, fontSize: 18, fontWeight: 'bold'}}>
            My <Text style={{color: '#99cc66'}}>Profile</Text>
          </Text>
        </View>
        {/* ====header== */}
        {/* ====viewAll== */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.viewAll}>
            <Heading size="md">View All</Heading>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: 'black',
              }}></View>
          </View>

          {/* ====viewAll== */}
          {/* ====profile== */}
          <View style={styles.profile}>
            <View style={styles.left}>
              {image ? (
                <TouchableOpacity
                  styl={{width: '100%', height: '100%'}}
                  onPress={pickImageOne}>
                  <ImageBackground
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: 'cover',
                      borderRadius: 5,
                      position: 'relative',
                    }}
                    imageStyle={{borderRadius: 50}}
                    //source={require('../images/user.png')} />
                    source={{uri: `${APIImage}/${path}/${image}`}}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                      }}>
                      <Feather name="camera" size={24} color="black" />
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  styl={{width: '100%', height: '100%'}}
                  onPress={pickImageOne}>
                  <ImageBackground
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: 'cover',
                      borderRadius: 5,
                    }}
                    source={require('../images/user.png')}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                      }}>
                      <Feather name="camera" size={24} color="white" />
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.right}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Heading size="sm">{getname}</Heading>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Heading size="lg">{mobile}</Heading>
                {getemail && getname && mobile && getAddress && image ? (
                  <Feather
                    name="check"
                    size={35}
                    color="white"
                    style={{
                      backgroundColor: '#4DD637',
                      borderRadius: 25,
                    }}
                  />
                ) : null}
              </View>
              <View>
                <Text style={{fontSize: 12}}>{getAddress}</Text>
                <Text style={{fontSize: 13}}>{getemail}</Text>
              </View>
            </View>
          </View>
          {/* ====profile== */}
          {/* ====form== */}
          <View style={{width: '100%', marginTop: 20}}>
            {/* =====location=== */}
            <View style={{width: '100%'}}>
              <View style={{...styles.location}}>
                <TouchableOpacity
                  onPress={getAddressDetails}
                  style={{...styles.locationButton, backgroundColor: 'black'}}>
                  <MaterialIcons name="my-location" size={24} color="white" />
                  <Heading size="sm" style={{color: 'white', marginLeft: 20}}>
                    Your Current Location
                  </Heading>
                </TouchableOpacity>

                <GooglePlacesAutocomplete
                  fetchDetails={true}
                  style={{backgroundColor: 'red'}}
                  placeholder="Search Other Location"
                  onPress={(data, details = null) => {
                    const address = data.description.split(',');
                    //  console.log(address, 'address')
                    setAddress(data.description);
                    setLat(details.geometry.location.lat);
                    setLong(details.geometry.location.lng);
                    //console.log(details,data)
                  }}
                  query={{
                    key: 'AIzaSyDGt77-gotuNZ4hFz6DkWBv4N0XFW3WJ6Q',
                    language: 'en',
                  }}
                  styles={{
                    textInputContainer: {
                      width: '100%',
                      marginTop: 15,
                    },
                    textInput: {
                      borderColor: 'black',
                      borderRadius: 10,
                      borderWidth: 1,
                      height: 48,
                      color: 'black',
                      fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                      color: 'black',
                    },
                  }}
                />
              </View>
            </View>
            {/* =====location=== */}
            <FormControl>
              <Stack mx={5} mt={2} style={styles.stack}>
                <FormControl.Label style={styles.labetext}>
                  <Heading size="sm"> Name</Heading>
                </FormControl.Label>
                <Input
                  p={2}
                  value={name}
                  onChangeText={name => setName(name)}
                  placeholder={getname ? getname : 'Enter Name'}
                />
              </Stack>
              <Stack mx={5} mt={2} style={styles.stack}>
                <FormControl.Label style={styles.labetext}>
                  <Heading size="sm"> Address</Heading>
                </FormControl.Label>
                <TextArea
                  value={address}
                  isReadOnly={true}
                  placeholder="Address placed Automatically"
                  h={16}
                  p={2}
                />
              </Stack>
              <Stack mx={5} mt={2} style={styles.stack}>
                <FormControl.Label style={styles.labetext}>
                  <Heading size="sm"> Email</Heading>
                </FormControl.Label>
                <Input
                  p={2}
                  value={email}
                  onChangeText={email => setEmail(email)}
                  placeholder={getemail ? getemail : 'Enter Email'}
                />
              </Stack>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 30,
                }}>
                <TouchableOpacity
                  style={{
                    marginLeft: 0,
                    marginRight: 0,
                    backgroundColor: '#99cc66',
                    width: '60%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 20,
                  }}
                  onPress={save}>
                  <Heading style={{color: 'white'}} size="md">
                    Update Profile
                  </Heading>
                </TouchableOpacity>
              </View>
            </FormControl>
          </View>
          {/* ====form== */}
          <View style={{height: 280}}></View>
        </ScrollView>
      </View>
      <ProgressDialog
        visible={lodding}
        message="Please, wait..."
        titleStyle={{color: 'red', textAlign: 'center'}}
        messageStyle={{color: 'green', textAlign: 'center'}}
        contentStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
        dialogStyle={{
          borderRadius: 10,
          width: 220,
          height: 70,
          justifyContent: 'center',
        }}
        activityIndicatorColor="blue"
        activityIndicatorSize="large"
        overlayStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      />
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingLeft: 10,
    flexDirection: 'row',
    marginVertical: 20,
  },
  mainWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  viewAll: {
    paddingHorizontal: 20,
  },
  profile: {
    width: '100%',
    height: 120,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    width: '34%',
    height: '100%',
  },
  right: {
    width: '64%',
    height: '100%',
  },
  location: {
    width: '100%',
    paddingHorizontal: 20,
  },
  locationButton: {
    width: '100%',
    height: 60,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  locationButton1: {
    width: 100,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#eeeeee',
  },
});

// import {
//     VStack,
//     Button,
//     FormControl,
//     Radio,
//     Checkbox,
//     Text,
//     Icon,
//     NativeBaseProvider,
//   } from 'native-base';
//   import React from 'react';
//   import { useForm, Controller } from 'react-hook-form';

//   function Profile() {
//     const { control, handleSubmit, formState: { errors }  } = useForm();
//     const onSubmit = (data) => {
//       console.log('submiting with ', data);
//     };
//     return (
//       <VStack width="80%" space={4}>

//         <FormControl isRequired isInvalid={'hobbies' in errors}>

//           <FormControl.Label>Hobbies</FormControl.Label>
//           <Controller
//             control={control}
//             render={({  field: { onChange }}) => (
//               <Checkbox.Group
//               accessible={true}

//                 onChange={(values) => {
//                   onChange(values);
//                 }}
//                 flexDirection="row"
//               >
//                 <Checkbox
//                   value="dart"
//                   accessible={true}
//                   accessibilityLabel="Tap me!"
//                   colorScheme="orange"
//                   icon={<Icon name="bullseye" type="MaterialCommunityIcons" />}
//                 >
//                   <Text mx={2}>Darts</Text>
//                 </Checkbox>
//                 <Checkbox
//                 accessible={true}
//                 accessibilityLabel="Tap me!"
//                   value="movie"
//                   colorScheme="dark"
//                   icon={<Icon name="bat" type="MaterialCommunityIcons" />}
//                 >
//                   <Text mx={2}>Movie</Text>
//                 </Checkbox>
//                 <Checkbox
//                 accessible={true}
//                 accessibilityLabel="Tap me!"
//                   colorScheme="red"
//                   value="camping"
//                   icon={<Icon name="campfire" type="MaterialCommunityIcons" />}
//                 >
//                   <Text mx={2}>Camping</Text>
//                 </Checkbox>
//                 <Checkbox
//                  accessibilityLabel="Tap mme!"
//                   value="chess"
//                   colorScheme="blue"
//                   icon={
//                     <Icon name="chess-knight" type="MaterialCommunityIcons" />
//                   }
//                 >
//                   <Text mx={2}>Chess</Text>
//                 </Checkbox>
//               </Checkbox.Group>
//             )}
//             rules={{ required: 'Atleast 1 hobbie needed' }}
//             name="hobbies"
//             defaultValue=""
//           />
//           <FormControl.ErrorMessage>
//             {errors.hobbies?.message}
//           </FormControl.ErrorMessage>
//         </FormControl>
//         <FormControl isRequired isInvalid={'gender' in errors}>
//           <FormControl.Label>Gender</FormControl.Label>
//           <Controller
//             control={control}
//             render={({  field: { onChange} }) => (
//               <Radio.Group
//               accessible={true}
//                 name="gender"
//                 flexDirection="row"
//                 onChange={(val) => onChange(val)}
//               >
//                 <Radio value="male" accessible={true}
//                     accessibilityLabel="Tap me!"
//    colorScheme="blue">
//                   <Text mx={2}>Male</Text>
//                 </Radio>
//                 <Radio value="female" accessible={true}
//   accessibilityLabel="Tap me!" colorScheme="pink">
//                   <Text mx={2}>Female</Text>
//                 </Radio>
//               </Radio.Group>
//             )}
//             name="gender"
//             rules={{ required: 'Gender is required' }}
//           />
//           <FormControl.ErrorMessage>
//             {errors.gender?.message}
//           </FormControl.ErrorMessage>
//         </FormControl>
//         <Button onPress={handleSubmit(onSubmit)} colorScheme="pink">
//           Submit
//         </Button>
//       </VStack>
//     );
//   }
//   export default Profile

// import React,{useState} from 'react'
// import { StyleSheet, Text, View ,TextInput,TouchableOpacity } from 'react-native'

// const Profile = () => {
//  const [name, setName] = useState('')
//  const [valid, setValid]=useState(true)

//  const changeHandal=(value)=>{
//   setName(value)
//   if (value.length == 3) {

//     setValid(false)
//   }else{
//     setValid(true)

//   }
//   console.log(value.length,value)
//  }

//   return (
//     <View style={{flex:1 ,justifyContent:'center',alignItems:'center'}}>
//       <TextInput
//        style={{width:"100%", height:40, borderRadius:5, borderWidth:2}}

//        onChangeText={(value)=>changeHandal(value)}
//        />
//        <TouchableOpacity
//        onPress={()=>alert('aaaaaaa')} disabled={valid} style={{width:100, height:50,backgroundColor:'red'}}>
//     <Text>
//           This  {name}
//    </Text>
// </TouchableOpacity>
//     </View>
//   )
// }

// export default Profile

// const styles = StyleSheet.create({})
