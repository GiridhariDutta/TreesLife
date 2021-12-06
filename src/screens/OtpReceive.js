import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import {Heading, useToast, Box} from 'native-base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import NextTextInput from 'react-native-next-input';

import {AuthContext} from '../components/AuthContext';
import {API} from '../components/Api';
import {ProgressDialog} from 'react-native-simple-dialogs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpReceive = ({navigation, route}) => {
  const mob = route.params.phone;
  const [phone, setPhone] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [otp, setOtp] = useState('');
  const [lodding, setLodding] = useState(false);
  const [enableshift, setenableShift] = useState(false);
  const [valid, setValid] = useState(true);
  const {signIn} = React.useContext(AuthContext);
  const toast = useToast();
  const alertTossata = msg => {
    return toast.show({
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
  const successTossata = msg => {
    return toast.show({
      render: () => {
        return (
          <Box
            style={{
              width: 180,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: '#E07C24',
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              {msg}
            </Text>
          </Box>
        );
      },
    });
  };

  const inputFromChildComponent = (
    combinedValueArray,
    currentValue,
    refForTheCurrentValue,
  ) => {
    //console.log(combinedValueArray,'combinedValueArray')
    // console.log(currentValue, "currentValue",)
    //console.log(refForTheCurrentValue,  "refForTheCurrentValue")
    const array = combinedValueArray;

    var myVar4 = combinedValueArray.join('');

    if (myVar4.length == 4) {
      setValid(false);
      setOtp(myVar4);
    } else {
      setValid(true);
    }
    // console.log(myVar4.length)
  };

  const login = () => {
    if (otp == '') {
      successTossata('Enter OTP');
      setLodding(false);
    } else {
      setLodding(true);
      const dataone = {
        otp: otp,
        phone: mob,
      };
      fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataone),
      })
        .then(res => {
          return res.json();
        })
        .then(async result => {
          // console.log(result,'TRD')
          if (result.success == true) {
            setLodding(false);
            //console.log(result.data)
            //signIn(result.data);
            await AsyncStorage.setItem('@user', JSON.stringify(result.data));
            navigation.navigate('Location');
          } else {
            alertTossata('Otp Invalid');
            setLodding(false);
          }
        })
        .catch(err => {
          console.log(err);
        });
      //
    }
  };
  // const handleBackBtnPressed = () => {
  //   props.navigation.navigate('SendMoneyScreen4');
  //   return true;
  // };
  //useEffect( async() => {
  // BackHandler.addEventListener('hardwareBackPress', handleBackBtnPressed);
  // return () => {
  //   BackHandler.removeEventListener(
  //     'hardwareBackPress',
  //     handleBackBtnPressed,
  //   );
  // };

  // }, [])

  return (
    <>
      <KeyboardAvoidingView behavior="position" enabled={enableshift}>
        <StatusBar hidden={true} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{marginLeft: 5, fontSize: 16, fontWeight: 'bold'}}>
            Login/Singup
          </Text>
        </View>
        <View style={styles.wrapper}>
          <View style={{width: '100%', height: 100}}></View>
          <Heading size="lg" style={styles.hedingOne}>
            Enter Verification Code
          </Heading>
          <Text style={styles.hedingTwo}>
            We Have sent you a 4 Digit Verification code on
          </Text>
          <View style={styles.inputView}>
            <NextTextInput
              noOfTextInput={4}
              clear={invalid}
              textInputStyle={styles.textBox}
              onChangeValue={inputFromChildComponent}
              parentViewStyle={styles.textBoxes}
            />
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              style={{...styles.login, opacity: valid ? 0.3 : 0.9}}
              disabled={valid}
              onPress={login}>
              <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
      </KeyboardAvoidingView>
    </>
  );
};

export default OtpReceive;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,

    alignItems: 'center',
    paddingLeft: 10,
    flexDirection: 'row',
  },
  wrapper: {
    width: '100%',
    height: '100%',

    flexDirection: 'column',

    alignItems: 'center',
  },
  inputView: {
    width: '100%',
    height: 70,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputField: {
    width: 50,
    height: 50,
    borderWidth: 1,
  },
  hedingTwo: {
    marginVertical: 15,
  },
  hedingOne: {
    marginVertical: 15,
  },
  textBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    color: 'black',
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  textBoxes: {
    color: 'white',
  },
  buttonView: {
    width: 200,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  login: {
    width: '60%',
    height: '80%',
    backgroundColor: '#99cc66',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
});
