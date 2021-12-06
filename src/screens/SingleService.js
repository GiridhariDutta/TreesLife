import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Heading, useToast, Box} from 'native-base';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import LocatioText from '../components/LocatioText';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../components/Api';

const SingleService = ({navigation, route}) => {
  const id = route.params.id;
  const isFocused = useIsFocused();
  const [vendor, setVendor] = useState([]);
  const oneVendor = async () => {
    //console.log(id, "id")

    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    const address = JSON.parse(await AsyncStorage.getItem('@address'));
    // console.log(address,'singser')
    fetch(`${API}/localservicefind/${id}/${address.lat}/${address.lon}`, {
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
        //console.log(result.data, 'sing')
        setVendor(result.data);
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    oneVendor();
  }, []);
  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
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
          <View style={{width: '90%', height: '100%'}}>
            <LocatioText height="100%" />
          </View>

          {/* ============ */}
        </View>
        {/* ============ header*/}

        {/* ============ servicesImageView */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.servicesImageView}>
            {vendor &&
              vendor.map((item, i) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('SingleVendor', {id: item.ID})
                    }
                    key={i}
                    style={styles.venderItemView}>
                    <View style={styles.upper}>
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                          borderRadius: 20,
                        }}
                        source={{
                          uri: `API/${item.IMAGE_PATH}/${item.IMAGE}`,
                        }}
                      />
                    </View>
                    <View style={styles.lower}>
                      <View>
                        <Heading size="xs">{item.NAME}</Heading>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Heading style={{fontSize: 15, marginRight: 5}}>
                          {item.RATING == 0 ? 'No Ratting' : item.RATING}
                        </Heading>
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
                        <Heading size="sm" style={{fontSize: 13}}>
                          {item.DESCRIPTION.substr(0, 20)}..
                        </Heading>
                      </View>
                    </View>
                    {/* ============ lower */}
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default SingleService;

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
    width: '90%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
  },

  title: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  servicesImageView: {
    paddingTop: 10,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row',

    paddingLeft: 10,
  },
  venderItemView: {
    width: '45%',
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
    borderRadius: 10,
  },
  lower: {
    width: '100%',
    height: '28%',
    paddingVertical: 8,
    paddingLeft: 5,
  },

  imaView: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
