import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  BackHandler,
  Alert,
} from 'react-native';

import Feather from 'react-native-vector-icons/dist/Feather';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import {Heading, Text, useToast, Box} from 'native-base';

import BackGroundCorsoul from './BackGroundCorsoul';
import {useIsFocused} from '@react-navigation/native';
import {ProgressDialog} from 'react-native-simple-dialogs';

import {API, APIImage} from '../components/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocatioText from '../components/LocatioText';

const SerVicesscreens = ({navigation}) => {
  const isFocused = useIsFocused();

  const [lodding, setLodding] = useState(false);

  const [item, setItem] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [imagess, setImage] = useState([]);
  const [name, setName] = useState('');
  const [starIconn, setStartIconn] = useState([]);
  const toast = useToast();
  const alertTossata = msg => {
    return toast.show({
      duration: 3000,
      render: () => {
        return (
          <Box
            style={{
              height: 50,
              padding: 10,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: 'red',
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              {msg}
            </Text>
          </Box>
        );
      },
    });
  };

  const ratingCompleted = () => {
    //
  };
  const allSlider = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    fetch(`${API}/sliders`, {
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
        //console.log(result);
        let slider = [];
        result.data.map((item, i) => {
          const data = {
            path:
              'http://tiipl.yoffers.in/' + item.slider_path + '/' + item.slider,
            id: item.id,
          };
          slider.push(data);
        });
        setImage(slider);
      })
      .catch(err => console.log(err));
  };
  const allvendor = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));

    const addlat = JSON.parse(await AsyncStorage.getItem('@address'));
    //console.log(addlat, 'addlat');
    fetch(`${API}/vendors/user/${addlat.lat}/${addlat.lon}`, {
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
        //console.log(result, 'vendor');
        if (result.success === true) {
          setVendor(result.data);
        } else console.log('no Vendor');
      })
      .catch(err => console.log(err));
  };

  const allservices = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    fetch(`${API}/services`, {
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
        setItem(result.data);
      })
      .catch(err => console.log(err));
  };
  const searChName = async () => {
    if (name == '') {
      alertTossata('Search Field Required');
    } else {
      setLodding(true);
      const user = JSON.parse(await AsyncStorage.getItem('@user'));
      fetch(`${API}/vendors/search/${name}`, {
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
          //alertTossata('No Data found')
          // console.log(result.data)
          if (result.success === true) {
            setLodding(false);
            setVendor(result.data);
            setName('');
            let starIcon = [];

            for (let index = 0; index < 5; index++) {
              starIcon.push('1');
            }
            setStartIconn(starIcon);
          } else {
            setLodding(false);
            alertTossata('No Data found');
            setName('');
          }
        })
        .catch(err => console.log(err));
    }
  };
  useEffect(() => {
    allservices();
    allvendor();
    allSlider();
    const backAction = () => {
      Alert.alert('Close App!', 'Are you sure you want to Exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'Exit', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isFocused]);
  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* ============ header */}
        <View style={styles.header}>
          <LocatioText navigation={navigation} height="50%" />
          {/* ============ */}
          <View style={styles.seacrcView}>
            <View style={styles.inputView}>
              <View style={styles.left}>
                <TextInput
                  style={{marginLeft: 15, color: 'black'}}
                  placeholderTextColor="black"
                  placeholderTextSize="30"
                  placeholder="Search"
                  value={name}
                  onChangeText={name => setName(name)}
                />
              </View>
              <TouchableOpacity onPress={searChName} style={styles.right}>
                <Feather name="search" size={28} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* ============ */}
        {/* ============ banner */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <BackGroundCorsoul images={imagess} navigation={navigation} />
          </View>
          {/* ============ banner */}
          {/* ============ allServices */}
          {/* <View style={{...styles.allServices}}>
            <View style={{...styles.title}}>
              <Text style={{fontSize: 20}}>Service</Text>
              <Text
                onPress={() => {
                  navigation.navigate('AllServicces');
                }}>
                See All
              </Text>
            </View>
          </View> */}
          {/* ============ allServices */}
          {/* <View style={styles.box}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {item &&
                item.map((item, i) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('SingleService', {id: item.ID})
                      }
                      key={i}
                      style={{
                        width: 95,
                        height: 120,
                        margin: 1,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: '70%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{...styles.imaView}}>
                          <Image
                            source={{
                              uri: `API/${item.PATH}/${item.IMAGE}`,
                            }}
                            style={styles.serviesIMage}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: '30%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                          flexDirection: 'row',
                        }}>
                        <Text>{item.NAME}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View> */}
          {/* ============ servicesImageView */}
          <View style={styles.servicesImageView}>
            {vendor &&
              vendor.map((item, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      ...styles.venderItemView,

                      paddingRight: 10,
                    }}>
                    <TouchableOpacity
                      style={styles.upper}
                      onPress={() =>
                        navigation.navigate('SingleVendor', {id: item.ID})
                      }>
                      <ImageBackground
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'center',
                        }}
                        imageStyle={{borderRadius: 20}}
                        source={{
                          uri: `${APIImage}/${item.IMAGE_PATH}/${item.IMAGE}`,
                        }}></ImageBackground>
                    </TouchableOpacity>
                    <View style={styles.lower}>
                      <View>
                        <Heading size="sm">{item.NAME.toUpperCase()}</Heading>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 14, marginRight: 5}}>
                          {item.RATING == 0 ? 'No Ratting' : item.RATING}
                        </Text>

                        {item.RATE_COUNT &&
                          item.RATE_COUNT.map((item, i) => {
                            return (
                              <Ionicons
                                key={i}
                                name="star-sharp"
                                size={22}
                                color="#FF7E1B"
                                style={{marginRight: 2}}
                              />
                            );
                          })}
                      </View>
                      <View>
                        <Text style={{fontSize: 13}}>
                          {item.DESCRIPTION.charAt(0).toUpperCase()}
                          {item.DESCRIPTION.substr(1, 20).toLowerCase()}..
                        </Text>
                      </View>
                    </View>
                    {/* ============ lower */}
                  </View>
                );
              })}
          </View>
          {/* <View style={{width:'100%',height:200, backgroundColor:'red'}}>
                 
                        </View>   */}
          <View style={{width: '100%', height: 90}}></View>
        </ScrollView>
        {/* ================ */}
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

export default SerVicesscreens;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 110,
    backgroundColor: '#99cc66',
    paddingBottom: 10,
  },

  seacrcView: {
    width: '100%',
    height: '50%',

    // justifyContent:"center",
    alignItems: 'center',
  },
  inputView: {
    width: '90%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
  },
  left: {
    width: '80%',
    height: '100%',
  },
  right: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  banner: {
    width: '100%',
    height: 230,
  },
  allServices: {
    width: '100%',
  },
  title: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  box: {
    width: '100%',
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxItem: {
    width: 100,
    height: 150,
    marginHorizontal: 5,
  },
  servicesImageView: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row',

    paddingLeft: 10,
  },
  venderItemView: {
    width: '100%',
    height: 300,
    marginRight: 15,
  },
  servicesImageitem: {
    width: '46%',
    height: 300,
    borderRadius: 10,
    flexDirection: 'column',
  },
  upper: {
    width: '100%',
    height: '72%',
    borderRadius: 20,
  },
  lower: {
    width: '100%',
    height: '28%',
    paddingVertical: 8,
    paddingLeft: 5,
  },
  back: {
    width: '100%',
  },
  serviesIMage: {
    width: '80%',
    height: '80%',
    resizeMode: 'cover',
  },
  imaView: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
