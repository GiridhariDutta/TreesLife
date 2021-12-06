import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  Button,
  Image,
} from 'react-native';
import {
  useToast,
  Box,
  Modal,
  Heading,
  FormControl,
  Select,
  CheckIcon,
  Input,
  TextArea,
  Checkbox,
  Stack,
} from 'native-base';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {ProgressDialog} from 'react-native-simple-dialogs';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../components/Api';
import {useIsFocused} from '@react-navigation/native';
import shortid from 'shortid';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const AddVendeor = ({navigation, route}) => {
  console.log(ImagePicker);
  const isFocused = useIsFocused();
  const [lodding, setLodding] = useState(false);

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [services, setServices] = useState('');
  const [mobile, setMobile] = useState('');
  const [description, setDescription] = useState('');
  const [latt, setLat] = useState('');
  const [longg, setLong] = useState('');
  const [allservices, setallservices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [groupValue, setGroupValue] = useState([]);
  const [days, setDays] = useState([]);
  const [image, setImage] = useState(null);
  const [openTimeFontend, setopenTimeFontend] = useState('00');
  const [openTimeBackend, setopenTimeBackend] = useState('');
  const [closeTimeFontend, setcloseTimeFontend] = useState('00');
  const [closeTimeBackend, setcloseTimeBackend] = useState('');
  const [listOfSeasons, setListOfSeasons] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleOne, setDatePickerVisibilityOne] = useState(false);
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
  // ==============showDatePickerOne
  const showDatePickerOne = () => {
    setDatePickerVisibilityOne(true);
    Keyboard.dismiss();
  };
  const hideDatePickerOne = () => {
    setDatePickerVisibilityOne(false);
  };
  const handleConfirmOne = date => {
    setcloseTimeBackend(`${date.getHours()}:${date.getMinutes()}`);
    let hour = date.getHours();
    //console.log(hour)
    if (hour > 9) {
      // console.log(hour,'9')
      setcloseTimeFontend(hour);
    } else {
      let hours = `0${date.getHours()}`;
      setcloseTimeFontend(hours);
    }
    hideDatePickerOne();
  };
  // ==============showDatePickerOne
  // ==============showDatePicker

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    Keyboard.dismiss();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setopenTimeBackend(`${date.getHours()}:${date.getMinutes()}`);
    let hour = date.getHours();
    //console.log(hour)
    if (hour > 9) {
      // console.log(hour,'9')
      setopenTimeFontend(hour);
    } else {
      let hours = `0${date.getHours()}`;
      setopenTimeFontend(hours);
    }
    hideDatePicker();
  };
  //    ================= showDatePicker
  const getSelectedGroupValue = () => {
    if (groupValue.length === 0) return '';
    let arrayString = groupValue.reduce(
      (accumulator, currentValue) => accumulator + ', ' + currentValue,
    );
    //console.log( typeof arrayString,arrayString)
    return arrayString;
  };

  const allDays = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    fetch(`${API}/days`, {
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
        setDays(result.data);
        //console.log(days)
      })
      .catch(err => console.log(err));
  };
  const getAllServices = async () => {
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
        console.log(result.data, 'da');
        //const data = result.data.filter(data => data.STATUS == 1);
        //console.log(data, 'da');
        setallservices(result.data);
        //console.log(days)
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
        // console.log(response.fileName, 'hh', response.path, response.type)

        setImage(response);
        //console.log(response.uri,response.fileName,response.type)
      }
    });
  };
  const pickImage = async () => {
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //console.log(response.fileName, 'hh', response.path, response.type)

        addToList(response.uri, response.fileName, response.type);
      }
    });
  };
  const addToList = async (item1, item2, item3) => {
    console.log(item1, 'item1', item2, 'item2', item3);
    try {
      const seasonToAdd = {
        id: shortid.generate(),
        imguri: item1,
        imgfilename: item2,
        imgtype: item3,
      };
      const storedValue = await AsyncStorage.getItem('@season_list');
      const prevList = await JSON.parse(storedValue);
      if (!prevList) {
        const newList = [seasonToAdd];

        await AsyncStorage.setItem('@season_list', JSON.stringify(newList));
        getList();
      } else {
        prevList.push(seasonToAdd);
        await AsyncStorage.setItem('@season_list', JSON.stringify(prevList));
        getList();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getList = async () => {
    const storedValue = await AsyncStorage.getItem('@season_list');
    if (!storedValue) {
      setListOfSeasons([]);
    }
    const list = JSON.parse(storedValue);
    setListOfSeasons(list);
  };

  const deleteSeason = async id => {
    const newList = await listOfSeasons.filter(list => list.id !== id);
    await AsyncStorage.setItem('@season_list', JSON.stringify(newList));
    setListOfSeasons(newList);
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
            //  console.log(loacation[1])
            setAddress(getloc);
            setLodding(false);
          })
          .catch(error => console.warn(error));
      })
      .catch(error => {
        const {code, message} = error;
        console.log(code, message);
      });
  };

  const save = async () => {
    const dayData = getSelectedGroupValue();

    // console.log(title,address,mobile,description,openTimeBackend,closeTimeBackend,dayData,lat,lon,services)
    let formData = new FormData();

    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    console.log(user);
    const storedValue = JSON.parse(await AsyncStorage.getItem('@season_list'));

    if (
      title == '' ||
      address == '' ||
      mobile == '' ||
      description == '' ||
      longg == '' ||
      services == '' ||
      dayData == '' ||
      latt == ''
    ) {
      alertTossata('All Field Required', '#E07C24');
    } else {
      setLodding(true);
      if (storedValue && storedValue.length > 0) {
        storedValue.map((item, i) => {
          const imagdata = {
            uri: item.imguri,
            name: item.imgfilename,
            type: item.imgtype,
          };
          formData.append('clipings[]', imagdata);
        });
      } else {
        formData.append('clipings[]', null);
      }
      let localUri = image.uri;
      let filename = image.fileName;
      let type = image.type;
      formData.append('image', {uri: localUri, name: filename, type});
      formData.append('user_id', user.id);
      formData.append('name', title);
      formData.append('address', address);
      formData.append('lat', latt);
      formData.append('lon', longg);
      formData.append('service_id', services);
      formData.append('mobile', mobile);
      formData.append('description', description);
      //formData.append('open_time', openTimeBackend);
      //formData.append('close_time', closeTimeBackend);
      formData.append('days', dayData);
      formData.append('is_trend', '');
      formData.append('slider_status', '');
      console.log(formData);
      return await fetch(`${API}/vendors`, {
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
          console.log(result);
          if (result.success == true) {
            await AsyncStorage.removeItem('@season_list');
            getList();
            setTitle('');
            setAddress('');
            setServices('');
            setMobile('');
            setDescription('');
            setopenTimeFontend('');
            setopenTimeBackend('');
            setcloseTimeFontend('');
            setcloseTimeBackend('');
            setImage('');

            alertTossata('Save Successfully', 'red');
            setLodding(false);
          }
        })
        .catch(err => console.log(err));
    }
  };
  useEffect(() => {
    // console.log(route)
    allDays();
    getList();
    getAllServices();
  }, []);

  return (
    <>
      {/* ==== mainWrapper  =====*/}

      <View style={styles.mainWrapper}>
        <StatusBar hidden={true} />
        {/* ==== Header  =====*/}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={28} color="black" />
          </TouchableOpacity>
          <Text style={{marginLeft: 3, fontSize: 18, fontWeight: 'bold'}}>
            Create <Text style={{color: '#99cc66'}}>Post</Text>
          </Text>
        </View>
        {/* ==== Header  =====*/}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View>
            {/* ==== Form  =====*/}
            <FormControl>
              <Stack mx={5} style={styles.stack}>
                <FormControl.Label style={styles.labetext}>
                  <Heading size="sm">
                    Tree Name<Text style={{color: 'red'}}>*</Text>
                  </Heading>
                </FormControl.Label>
                <Input
                  variant="rounded"
                  value={title}
                  onChangeText={title => setTitle(title)}
                />
              </Stack>

              <Stack mx={5} style={styles.stack}>
                <FormControl>
                  <FormControl.Label>
                    <Heading size="sm" ml={2}>
                      Tree Type{' '}
                    </Heading>
                  </FormControl.Label>
                  <Select
                    style={{height: 40}}
                    selectedValue={services}
                    variant="rounded"
                    accessibilityLabel="Service"
                    placeholder="Tree Type"
                    onValueChange={itemValue => {
                      setServices(itemValue);
                    }}
                    _selectedItem={{
                      bg: 'pink.600',
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt={1}>
                    {allservices &&
                      allservices.map((item, i) => {
                        return (
                          <Select.Item
                            key={i}
                            label={item.NAME}
                            value={item.ID}
                          />
                        );
                      })}
                  </Select>
                </FormControl>
              </Stack>
              <Stack mx={5} style={styles.stack}>
                <FormControl.Label style={styles.labetext}>
                  <Heading size="sm">Testing</Heading>
                </FormControl.Label>
                <Input
                  variant="rounded"
                  value={mobile}
                  keyboardType="default"
                  maxLength={10}
                  onChangeText={mobile => setMobile(mobile)}
                />
              </Stack>
              <Stack mx={5} style={styles.stack}>
                <FormControl.Label style={styles.labetext}>
                  <Heading size="sm">Description</Heading>
                </FormControl.Label>
                <TextArea
                  h={20}
                  variant="rounded"
                  value={description}
                  onChangeText={description => setDescription(description)}
                />
              </Stack>
            </FormControl>
            {/* ==== Form  =====*/}
          </View>
          {/* ==== Loaciton  =====*/}
          <View style={styles.location}>
            <Heading size="sm" mt={2}>
              Loaction
            </Heading>
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
                console.log(data, details);
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

          <Stack mx={5} style={styles.stack}>
            <FormControl.Label style={styles.labetext}>
              <Heading size="sm">Address</Heading>
            </FormControl.Label>
            <TextArea
              h={26}
              variant="rounded"
              value={address}
              numberOfLines={4}
              editable={false}
              placeholderTextColor="red"
              style={styles.input1}
            />
          </Stack>
          {/* ==== Loacation  =====*/}
          {/* ==== Time  =====*/}
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingLeft: 20,
              justifyContent: 'flex-start',
            }}>
            {/* <View style={{width: '100%'}}>
              <Heading size="sm" my={2}>
                Tree Type
              </Heading>
            </View> */}
            {/* <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={{...styles.locationButton1}}>
                <Heading size="md">{openTimeFontend}</Heading>
                <Heading size="md" style={{marginLeft: 10}}>
                  {' '}
                  am
                </Heading>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showDatePickerOne}
                style={{...styles.locationButton1, marginLeft: 10}}>
                <Heading size="md">{closeTimeFontend}</Heading>
                <Heading size="md" style={{marginLeft: 10}}>
                  pm
                </Heading>
              </TouchableOpacity>
            </View> */}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisibleOne}
              mode="time"
              onConfirm={handleConfirmOne}
              onCancel={hideDatePickerOne}
            />
          </View>
          {/* ==== Time  =====*/}
          <View style={{...styles.toggle}}>
            <Heading size="sm" style={{marginVertical: 4}}>
              Place Type
            </Heading>

            <FormControl>
              <Checkbox.Group
                accessible={true}
                colorScheme="green"
                defaultValue={days}
                onChange={values => {
                  setGroupValue(values || []);
                }}>
                {days &&
                  days.map((item, i) => {
                    return (
                      <View
                        accessible={true}
                        key={i}
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                          width: '100%',
                          marginTop: 5,
                        }}>
                        <Text size="sm" style={{marginLeft: -5}}>
                          {' '}
                          {item.NAME}
                        </Text>
                        <Checkbox
                          accessible={true}
                          accessibilityLabel="Tap me!"
                          value={item.ID.toString()}
                          my={0.6}></Checkbox>
                      </View>
                    );
                  })}
              </Checkbox.Group>
            </FormControl>
          </View>
          <View style={{...styles.box}}>
            <View style={styles.title}>
              <Heading size="sm" style={{marginVertical: 4}}>
                Upload Primary Display
              </Heading>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {image == null ? (
                <View style={styles.boxItem}>
                  <Text style={{color: 'black'}}>No Image</Text>
                </View>
              ) : (
                <View style={styles.boxItem2}>
                  <Image
                    source={{uri: image.uri}}
                    style={{width: '100%', height: '100%', borderRadius: 5}}
                    resizeMode="cover"
                  />
                </View>
              )}
              <View style={styles.boxItem2}>
                <TouchableOpacity
                  onPress={pickImageOne}
                  style={{
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FontAwesome5 name="plus" size={44} color="black" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <View style={styles.allServices}>
            <View style={styles.title}>
              <Heading size="sm" style={{marginVertical: 7}}>
                Upload More Photos
              </Heading>
            </View>
            <View style={{with: '100%', height: 100, flexDirection: 'column'}}>
              <View
                style={{
                  width: '100%',
                  height: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {listOfSeasons && listOfSeasons.length == 0 ? null : (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {listOfSeasons &&
                      listOfSeasons.map((item, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              width: 65,
                              height: 65,
                              borderColor: 'black',
                              backgroundColor: 'white',
                              opacity: 0.7,
                              borderWidth: 2,
                              marginHorizontal: 3,
                            }}>
                            <ImageBackground
                              source={{uri: item.imguri}}
                              style={{width: '100%', height: '100%'}}
                              resizeMode="cover">
                              <TouchableOpacity
                                onPress={() => deleteSeason(item.id)}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <MaterialIcons
                                  name="delete-outline"
                                  size={24}
                                  color="red"
                                />
                              </TouchableOpacity>
                            </ImageBackground>
                          </View>
                        );
                      })}
                  </ScrollView>
                )}
              </View>
              <View
                style={{
                  width: '100%',
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    width: 50,
                    height: 50,
                    borderWidth: 2,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FontAwesome5 name="plus" size={44} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* ============ allServices */}

          <View
            style={{
              width: '100%',
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: '50%',
                height: 50,
                backgroundColor: '#99cc66',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 25,
              }}
              onPress={save}>
              <Heading size="md" style={{color: 'white'}}>
                Submit
              </Heading>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%', height: 90}}></View>
        </ScrollView>
      </View>

      {/* ==== mainWrapper  =====*/}
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

export default AddVendeor;

const styles = StyleSheet.create({
  modalView: {
    borderRadius: 50,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  mainWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 40,

    alignItems: 'center',
    paddingLeft: 10,
    flexDirection: 'row',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 25,
    height: 45,
    paddingLeft: 25,
  },
  input1: {
    height: 70,
    paddingLeft: 25,
  },
  labetext: {
    marginLeft: 10,
    fontWeight: '900',
  },
  stack: {
    marginTop: 10,
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
  toggle: {
    width: '100%',
    padding: 20,
    height: 280,
  },
  togleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: '100%',
    paddingLeft: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  boxItem: {
    width: 70,
    height: 70,

    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxItem1: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 10,

    backgroundColor: 'yellowgreen',
  },
  boxItem2: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allServices: {
    width: '100%',
    paddingLeft: 20,
    paddingVertical: 20,
  },
  title: {
    width: '100%',
    height: 40,
  },
});
