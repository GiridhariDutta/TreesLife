import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {useIsFocused} from '@react-navigation/native';

import {useToast, Box, Heading, Modal, Button, Input, Badge} from 'native-base';

import LocatioText from '../components/LocatioText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API, APIImage} from '../components/Api';
import {ProgressDialog} from 'react-native-simple-dialogs';

const SingleVendor = ({navigation, route}) => {
  const id = route.params.id;
  // console.log(Rating.fractions)
  const isFocused = useIsFocused();
  const [lodding, setLodding] = useState(false);
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const [addresse, setAddress] = useState('');
  const [nameven, setNameVen] = useState('');
  const [ratting, setRatting] = useState('');
  const [path, setPath] = useState('');
  const [image, setImage] = useState('');
  const [open, setOpen] = useState('');
  const [close, setClose] = useState('');
  const [clipping, setClipping] = useState();
  const [desc, setDesc] = useState('');
  const [allRatting, setAllRatting] = useState([]);
  const [allGetDays, setallGetDays] = useState([]);
  const toast = useToast();
  // To set the max number of Stars
  const [starIconn, setStartIconn] = useState([]);
  const [defaultRating, setDefaultRating] = useState(0);

  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setactiveIndex] = useState(0);
  const [getPopUp, setGetPopUp] = useState('');

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
  const ratttinsend = async () => {
    if (message == '' || defaultRating == '') {
      alertTossata('All Field required', 'red');
    } else {
      setLodding(true);
      const user = JSON.parse(await AsyncStorage.getItem('@user'));
      const dataOne = {
        posted_id: user.id,
        point: defaultRating,
        message: message,
        vendor_id: route.params.id,
      };

      fetch(`${API}/ratting`, {
        method: 'POST',
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
        .then(result => {
          //console.log(result)
          if (result.success == true) {
            setLodding(false);
            alertTossata('Ratting Save Successfully', 'red');
            setMessage('');
            setDefaultRating(0);
            getallRatting(id);
            oneVendorRatting();
          } else {
            setLodding(false);
            alertTossata('NO Save', 'red');
          }
        })
        .catch(err => console.log(err));
    }
  };
  const oneVendorRatting = async () => {
    //console.log(id, "id")

    // API/vendors/find/16
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    //console.log(user)
    fetch(`${API}/vendors/find/${id}`, {
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
        // console.log(result)

        setMobile(result.data.vendor.MOBILE);
        setNameVen(result.data.vendor.NAME);
        setRatting(result.data.vendor.RATING);
        setPath(result.data.vendor.IMAGE_PATH);
        setImage(result.data.vendor.IMAGE);

        setClose(result.data.vendor.CLOSE_TIME);
        setAddress(result.data.vendor.ADDRESS);
        setDesc(result.data.vendor.DESCRIPTION);
        setClipping(result.data.cliping);
        setallGetDays(result.data.days);
        let openTime = result.data.vendor.OPEN_TIME.split(':');
        let closeTime = result.data.vendor.CLOSE_TIME.split(':');
        setOpen(`${openTime[0]}:${openTime[1]}`);
        setClose(`${closeTime[0]}:${closeTime[1]}`);
        //console.log(clipping)
        let starIcon = [];
        for (let index = 0; index < result.data.vendor.RATING; index++) {
          starIcon.push('1');
        }
        setStartIconn(starIcon);
      })
      .catch(err => console.log(err));
  };
  const oneVendor = async () => {
    //console.log(id, "id")
    setLodding(true);
    // API/vendors/find/16
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    //console.log(user)
    fetch(`${API}/vendors/find/${id}`, {
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
        console.log(result, 'result');
        setLodding(false);
        setMobile(result.data.vendor.MOBILE);
        setNameVen(result.data.vendor.NAME);
        setRatting(result.data.vendor.RATING);
        setPath(result.data.vendor.IMAGE_PATH);
        setImage(result.data.vendor.IMAGE);

        setClose(result.data.vendor.CLOSE_TIME);
        setAddress(result.data.vendor.ADDRESS);
        setDesc(result.data.vendor.DESCRIPTION);
        setClipping(result.data.cliping);
        setallGetDays(result.data.days);
        // let openTime = result.data.vendor.OPEN_TIME.split(':');
        // let closeTime = result.data.vendor.CLOSE_TIME.split(':');
        // setOpen(`${openTime[0]}:${openTime[1]}`);
        // setClose(`${closeTime[0]}:${closeTime[1]}`);
        // console.log(clipping);
        let starIcon = [];
        for (let index = 0; index < result.data.vendor.RATING; index++) {
          starIcon.push('1');
        }
        setStartIconn(starIcon);
      })
      .catch(err => console.log(err));
  };
  const getallRatting = async () => {
    // console.log(id) API/vendors/find/98
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    fetch(`${API}/ratting/${id}`, {
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
        // console.log(result)
        if (result.success == true) {
          setAllRatting(result.data);
        } else {
          alertTossata('NO Data', 'red');
        }
        // console.log(result,'ratt')
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getallRatting();
    oneVendor();

    //console.log(route.params.id)
  }, []);

  const shhowModal = () => {
    return (
      <Modal isOpen={false}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Modal Title</Modal.Header>
          <Modal.Body>
            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
            ullamco deserunt aute id consequat veniam incididunt duis in sint
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}></Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    );
  };

  // const setactiveIndex=()=>{
  //     //
  // }

  const openWhatsApp = mobile => {
    let msg = 'hi';

    if (mobile) {
      if (msg) {
        let url = 'whatsapp://send?text=' + msg + '&phone=91' + mobile;
        Linking.openURL(url)
          .then(data => {
            console.log('WhatsApp Opened successfully ' + data);
          })
          .catch(() => {
            alert('Make sure WhatsApp installed on your device');
          });
      } else {
        alert('Please enter message to send');
      }
    } else {
      alert('Please enter mobile no');
    }
  };
  const callAction = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telpromt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const popUPP = item => {
    //console.log(item)

    setGetPopUp(item);
    setShowModal(true);
  };
  return (
    <>
      <View style={{flex: 1}}>
        {/* ============ header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: '10%',
              height: '100%',
              justifyContent: 'center',
              paddingLeft: 10,
            }}>
            <AntDesign name="left" size={28} color="white" />
          </TouchableOpacity>
          <View
            style={{
              width: '90%',
              height: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <LocatioText navigation={navigation} height="100%" />
          </View>

          {/* ============ */}
        </View>
        {/* ============ header*/}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          {/* ============ Reatting*/}
          <View style={styles.servicesImageView}>
            <View style={styles.servicesImageitem}>
              <View style={styles.upper}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}
                  source={{uri: `${APIImage}/${path}/${image}`}}
                />
              </View>
              {/* ============ lower  */}
              <View style={styles.lower}>
                <View>
                  <Heading size="sm">{nameven}</Heading>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 5,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Text style={{marginRight: 5, fontSize: 13}}>
                    {ratting ? ratting : 'No Ratting'}
                  </Text>
                  {starIconn &&
                    starIconn.map((item, i) => {
                      return (
                        <Ionicons
                          key={i}
                          name="star-sharp"
                          size={26}
                          color="#FF7E1B"
                          style={{marginRight: 2}}
                        />
                      );
                    })}
                </View>
                <View>
                  <Text style={{fontSize: 15, marginBottom: 5}}>
                    {addresse}
                  </Text>
                  <Text style={{fontSize: 13, marginBottom: 5}}>{desc}</Text>
                </View>
                {/* <View style={{...styles.rattingLowerButtonView}}> */}
                {/* <TouchableOpacity
                    onPress={() => callAction(mobile)}
                    style={[
                      styles.rattinlowerButton,
                      {backgroundColor: 'green'},
                    ]}>
                    <Heading size="lg" style={{color: 'white'}}>
                      Call
                    </Heading>
                  </TouchableOpacity> */}
                {/* <TouchableOpacity
                    onPress={() => openWhatsApp(mobile)}
                    style={[
                      styles.rattinlowerButton,
                      {backgroundColor: 'black'},
                    ]}>
                    <Heading size="lg" style={{color: 'white'}}>
                      Chat
                    </Heading>
                  </TouchableOpacity> */}
                {/* </View> */}
              </View>
              {/* ============ lower */}
            </View>
          </View>
          {/* ============ Reatting*/}

          {/* ============ allServices */}
          <View style={{...styles.allServices}}>
            <View style={styles.title}>
              <Heading size="md">Photos</Heading>
            </View>
          </View>

          {/* ============ allServices */}
          <View style={{...styles.box}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {clipping &&
                clipping.map((item, i) => {
                  return (
                    <View key={i}>
                      <TouchableOpacity
                        style={styles.boxItem}
                        onPress={() =>
                          popUPP(`${APIImage}/${item.IMAGE_PATH}/${item.IMAGE}`)
                        }>
                        <ImageBackground
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          imageStyle={{borderRadius: 10}}
                          source={{
                            uri: `${APIImage}/${item.IMAGE_PATH}/${item.IMAGE}`,
                          }}></ImageBackground>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content style={{width: 325, height: 300}}>
                  <Image
                    style={{
                      width: 275,
                      height: 250,
                      resizeMode: 'cover',
                    }}
                    source={{uri: getPopUp}}
                  />
                </Modal.Content>
              </Modal>
            </ScrollView>
          </View>
          {/* ============ day Time */}
          <View
            style={{width: '100%', justifyContent: 'center', paddingLeft: 20}}>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 15,
                justifyContent: 'flex-start',
              }}>
              {/* <Heading size="sm" style={{color: 'red'}}>
                Location Type:-{' '}
              </Heading>
              <Text style={{marginLeft: 20}}>
                
              </Text> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 5,
                flexWrap: 'wrap',
              }}>
              <Heading size="sm" style={{color: 'red'}}>
                Additional Info:-
              </Heading>
              {allGetDays &&
                allGetDays.map((item, i) => {
                  return (
                    <Badge
                      variant="outline"
                      colorScheme="dark"
                      key={i}
                      mx={1}
                      my={1}>
                      <Text>{item.NAME}</Text>
                    </Badge>
                  );
                })}
            </View>
          </View>
          {/* ============ day Time */}
          {/* ============ Rating Submit */}
          <View style={{width: '100%'}}>
            <View
              style={{
                width: '100%',
                height: 10,
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View
                style={{
                  width: '90%',
                  height: 0.5,
                  backgroundColor: '#03203C',
                  opacity: 0.5,
                }}></View>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginLeft: 20,
              }}>
              <Heading
                size="sm"
                style={{
                  marginVertical: 3,
                }}>
                Reviews & Rating
              </Heading>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginLeft: 20,
              }}>
              {maxRating.map((item, key) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                    onPress={() => setDefaultRating(item)}>
                    {item <= defaultRating ? (
                      <Ionicons
                        name="star-sharp"
                        size={29}
                        color="#FF7E1B"
                        style={{marginRight: 5}}
                      />
                    ) : (
                      <Ionicons
                        name="star-outline"
                        size={29}
                        style={{marginRight: 5}}
                        color="#FF7E1B"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={{
                width: '100%',
                paddingVertical: 6,
                paddingHorizontal: 20,
              }}>
              <Input
                placeholderTextColor="black"
                value={message}
                onChangeText={message => setMessage(message)}
                style={{width: '100%', height: 60, borderWidth: 1}}
              />
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
                paddingRight: 20,
                paddingVertical: 15,
              }}>
              <TouchableOpacity
                onPress={ratttinsend}
                style={{
                  width: 100,
                  height: 40,
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#99cc66',
                }}>
                <Heading size="md" style={{color: 'white'}}>
                  Submit
                </Heading>
              </TouchableOpacity>
            </View>
          </View>
          {/* ============ Rating Submit */}
          {/* ============ All Review */}

          <View style={{width: '100%', height: 300}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}>
              {allRatting &&
                allRatting.map((item, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        width: '100%',
                        height: 100,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      <View
                        style={{
                          width: '20%',
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={require('../images/user.png')}
                          style={{width: 50, height: 50, resizeMode: 'cover'}}
                        />
                      </View>
                      <View
                        style={{
                          width: '60%',
                          height: '100%',
                          paddingTop: 10,
                          paddingLeft: 5,
                        }}>
                        <Heading size="sm">{item.user}</Heading>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 7,
                          }}>
                          <FontAwesome
                            name="quote-left"
                            size={16}
                            color="black"
                            style={{marginRight: 5}}
                          />
                          <Text style={{fontSize: 13}}>{item.message}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '20%',
                          height: '100%',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <AntDesign name="star" size={20} color="green" />
                        <Text
                          style={{
                            marginLeft: 7,
                            color: 'green',
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.point}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
          </View>

          {/* <FlatList
                            data={item}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        /> */}
          {/* ============ All Review */}
          <View style={{height: 50}}></View>
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

export default SingleVendor;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    backgroundColor: '#99cc66',
    flexDirection: 'row',
  },

  seacrcView: {
    width: '100%',
    height: '50%',

    // justifyContent:"center",
    alignItems: 'center',
  },
  inputView: {
    width: '100%',
    height: '100%',

    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
  },
  left: {
    width: '70%',
    height: '100%',
  },
  right: {
    width: '30%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 250,
  },
  allServices: {
    width: '100%',
    paddingLeft: 20,
  },
  title: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxItem: {
    width: 250,
    height: 150,

    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  servicesImageView: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  servicesImageitem: {
    width: '100%',
    borderRadius: 10,
    flexDirection: 'column',
  },
  upper: {
    width: '100%',
    height: 210,
    borderRadius: 10,
  },
  lower: {
    width: '100%',
    height: 130,
    paddingTop: 8,
  },
  rattingLowerButtonView: {
    width: '100%',
    height: 0,
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rattinlowerButton: {
    width: '49%',
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  back: {
    width: '100%',
  },
});
