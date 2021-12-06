import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import {Heading} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ProgressDialog} from 'react-native-simple-dialogs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../components/Api';
import {AuthContext} from '../components/AuthContext';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
const Location = ({navigation}) => {
  const [lati, setLati] = useState('');
  const [long, setLogn] = useState('');
  const [lodding, setLodding] = useState(false);
  // const {getAddresr} = React.useContext(AuthContext);
  const getAddresr = async address => {
    const latt = address.lat;
    const lat = latt.toString();

    try {
      await AsyncStorage.setItem('@address', JSON.stringify(address));
      await AsyncStorage.setItem('@lat', lat);
      navigation.navigate('AllBottom');
    } catch (e) {
      console.log(e);
    }
  };
  const getLocation = () => {
    setLodding(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        //console.log(location,'latitude"');
        setLati(location.latitude);
        setLogn(location.longitude);
        Geocoder.init('AIzaSyDGt77-gotuNZ4hFz6DkWBv4N0XFW3WJ6Q'); // use a valid API key

        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            var getloc = json.results[0].formatted_address;
            //console.log(json, 'get');

            addRessSave(getloc, location.latitude, location.longitude);
          })
          .catch(error => console.warn(error));
      })
      .catch(error => {
        const {code, message} = error;
        console.log(code, message);
      });
  };
  const addRessSave = async (address, latti, longg) => {
    //console.log(address)
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    const dataone = {
      address: address,
      latitude: latti,
      longitude: longg,
    };
    fetch(`${API}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user._token}`,
      },
      body: JSON.stringify(dataone),
    })
      .then(res => {
        return res.json();
      })
      .then(async result => {
        //console.log(result,'TRD')
        if (result.success == true) {
          setLati('');
          setLogn('');
          setLodding(false);
          // await AsyncStorage.setItem('@address', JSON.stringify(result.data))
          //
          getAddresr(result.data);
        } else {
          alert('Address does notUpdated');
          setLodding(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
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
  }, []);
  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar hidden={true} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.wrapper}>
              <Text>Nice to meet you!</Text>
              <Heading size="lg">See Trees around</Heading>
            </View>
            <View style={styles.imageView}>
              <View style={styles.imageViewInner}>
                <Image
                  style={{
                    width: '100%',
                    borderRadius: 15,
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                  source={require('../../src/images/TREE-LOGO.png')}
                />
              </View>
            </View>
            <View style={styles.location}>
              <TouchableOpacity
                onPress={getLocation}
                style={{...styles.locationButton, backgroundColor: 'black'}}>
                <MaterialIcons name="my-location" size={24} color="white" />
                <Heading size="sm" style={{color: 'white', marginLeft: 20}}>
                  Your Current Location
                </Heading>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SearchLocatin');
                }}
                style={{
                  ...styles.locationButton,
                  borderWidth: 1,
                  marginTop: 20,
                }}>
                <Ionicons name="search-outline" size={24} color="black" />
                <Heading size="sm" style={{color: 'black', marginLeft: 20}}>
                  Some Other Location
                </Heading>
              </TouchableOpacity>
            </View>
          </View>
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

export default Location;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingLeft: 10,
    flexDirection: 'row',
  },
  location: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    width: '80%',
    height: 60,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  locationButton1: {
    width: '30%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#eeeeee',
  },
  imageView: {
    width: '100%',
    height: 160,

    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  imageViewInner: {
    width: '80%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
