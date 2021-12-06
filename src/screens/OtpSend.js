import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {Heading, Box, useToast} from 'native-base';
import axios from 'axios';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {API} from '../components/Api';

const OtpSend = ({navigation}) => {
  const toast = useToast();
  const [lodding, setLodding] = useState(false);
  const [enableshift, setenableShift] = useState(false);
  const [valid, setValid] = useState(true);
  const [phone, setPhone] = useState('');
  const changeHandal = value => {
    setPhone(value);
    if (value.length == 10) {
      setValid(false);
    } else {
      setValid(true);
    }
  };
  const alertTossata = msg => {
    return toast.show({
      render: () => {
        return (
          <Box
            style={{
              width: 280,
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
  const successTossata = msg => {
    return toast.show({
      render: () => {
        return (
          <Box
            style={{
              width: 280,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: '#4DD637',
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              {msg}
            </Text>
          </Box>
        );
      },
    });
  };

  // useEffect(() => {
  //    console.log(isAutheticated(),'onme')
  // }, [])

  const register = async () => {
    console.log(phone);
    if (phone == '') {
      successTossata('Mobile No Required');
    } else {
      if (phone.length < 10) {
        alertTossata('Mobile No Must 10 Digit');
      } else {
        setLodding(true);
        axios
          .post(`${API}/register`, {
            phone: phone,
          })
          .then(async res => {
            // console.log(res.data, 'data');
            if (res.data.success == true) {
              setLodding(false);
              setPhone('');
              setValid(true);
              navigation.navigate('OtpReceive', {phone: res.data.data.phone});
            } else {
              setLodding(false);
              alertTossata('Mobile No Must 10 Digit');
            }
          })
          .catch(err => {
            console.log(err, 'uuu');
          });
      }
    }
  };
  useEffect(() => {
    setValid(true);
  }, []);

  return (
    <>
      <KeyboardAvoidingView behavior="position" enabled={enableshift}>
        <StatusBar hidden={true} />
        <View
          style={{
            width: '100%',
            height: 250,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <View style={styles.logoView}>
            <Image
              style={styles.logoImage}
              source={require('../../src/images/logo.png')}
            />
          </View>
        </View>
        <View
          style={{width: '100%', alignItems: 'center', paddingVertical: 10}}>
          <Heading size="lg">Your Services Expert</Heading>
        </View>
        <View style={{width: '100%'}}>
          <View style={styles.mobile}>
            <View style={styles.inputBox}>
              <View style={styles.left}>
                <Image
                  style={styles.flag}
                  source={require('../../src/images/flag.png')}
                />
                <Heading size="md" style={{marginLeft: 3}}>
                  +91
                </Heading>
              </View>
              <View style={styles.middle}>
                <View style={styles.inner}></View>
              </View>

              <View style={styles.right}>
                <TextInput
                  style={styles.inputStyle}
                  keyboardType="numeric"
                  onChangeText={value => changeHandal(value)}
                  onFocus={() => setenableShift(true)}
                  maxLength={10}
                  value={phone}
                />
              </View>
            </View>
            {/* =============== input */}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            disabled={valid}
            style={{
              width: '40%',
              height: '100%',
              backgroundColor: '#99cc66',
              opacity: valid ? 0.3 : 0.9,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
            }}
            onPress={register}>
            <Heading size="md" style={{color: 'white'}}>
              Send
            </Heading>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

export default OtpSend;

const styles = StyleSheet.create({
  wraper: {
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logoView: {
    width: 200,
    height: 200,
  },
  heading: {
    marginVertical: 15,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mobile: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: '80%',
    height: '80%',
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 10,
    flexDirection: 'row',
  },
  left: {
    width: '30%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  middle: {
    width: '1%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    height: '80%',
    backgroundColor: 'black',
  },
  right: {
    width: '69%',
    height: '100%',
  },
  flag: {
    width: '50%',
    height: '50%',
    resizeMode: 'cover',
  },
  inputStyle: {
    color: 'black',
    paddingLeft: 15,
    fontSize: 25,
    lineHeight: 23,
    flex: 2,
  },
});
