// In App.js in a new project
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/screens/Home';
import OtpSend from './src/screens/OtpSend';
import {NativeBaseProvider} from 'native-base';
import OtpReceive from './src/screens/OtpReceive';

import AllBottom from './src/components/AllBottom';
import SingleVendor from './src/screens/SingleVendor';
import AllServicces from './src/screens/AllServicces';
import Location from './src/screens/Location';
import SearchLocatin from './src/screens/SearchLocatin';
import SingleService from './src/screens/SingleService';
import Top from './src/screens/Top';
import {PermissionsAndroid, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();
import {AuthContext} from './src/components/AuthContext';
import SplashScreen from 'react-native-splash-screen';
function App() {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    lat: null,
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'ADDRESS':
        return {
          ...prevState,
          lat: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async userdata => {
        const userToken = userdata._token;
        const userName = userdata.id;

        try {
          await AsyncStorage.setItem('@user', JSON.stringify(userdata));
          await AsyncStorage.setItem('@userToken', userToken);
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGIN', id: userName, token: userToken});
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('@user');
          const userToken = await AsyncStorage.removeItem('@userToken');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },

      getAddresr: async address => {
        const latt = address.lat;
        const lat = latt.toString();

        try {
          await AsyncStorage.setItem('@address', JSON.stringify(address));
          await AsyncStorage.setItem('@lat', lat);
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'ADDRESS', token: lat});
      },
    }),
    [],
  );

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
    // setTimeout(async () => {
    //   let userToken;
    //   let lat;
    //   userToken = null;
    //   lat = null;
    //   try {
    //     userToken = await AsyncStorage.getItem('@userToken');
    //     lat = await AsyncStorage.getItem('@lat');
    //   } catch (e) {
    //     console.log(e);
    //   }

    //   dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    //   dispatch({type: 'ADDRESS', token: lat});
    // }, 3000);
  }, []);
  return (
    <AuthContext.Provider value={authContext}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="Top" component={Top} />
            <Stack.Screen name="OtpSend" component={OtpSend} />
            <Stack.Screen name="OtpReceive" component={OtpReceive} />

            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="SearchLocatin" component={SearchLocatin} />

            <Stack.Screen name="AllBottom" component={AllBottom} />
            <Stack.Screen name="AllServicces" component={AllServicces} />
            <Stack.Screen name="SingleService" component={SingleService} />

            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SingleVendor" component={SingleVendor} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthContext.Provider>
  );
}

export default App;
