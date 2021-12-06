import * as React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SerVicesscreens from '../screens/SerVicesscreens';
import AddVendeor from '../screens/AddVendeor';
import Profile from '../screens/Profile';
import ShareScreen from '../screens/ShareScreen';
import MyAdd from '../screens/MyAdd';

const Tab = createBottomTabNavigator();

const AllBottom = () => {
  const Addtab = ({children, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        top: -30,
      }}>
      <View
        style={{
          width: 60,
          height: 60,
          top: 5,
          borderRadius: 30,
          backgroundColor: 'white',
        }}>
        {children}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Tab.Navigator
        tabBarOptions={{
          showLabel: false,
          style: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            height: 60,
          },
        }}>
        <Tab.Screen
          name="SerVicesscreens"
          component={SerVicesscreens}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../images/dog-house.png')}
                  resizeMode="cover"
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: focused ? '#99cc66' : 'black',
                  }}
                />
                <Text
                  style={{color: focused ? '#99cc66' : 'black', marginTop: 5}}>
                  HOME
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ShareScreen"
          component={ShareScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../images/share.png')}
                  resizeMode="cover"
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: focused ? '#99cc66' : 'black',
                  }}
                />
                <Text
                  style={{color: focused ? '#99cc66' : 'black', marginTop: 5}}>
                  SHARE
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="AddVendeor"
          component={AddVendeor}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../images/add.png')}
                resizeMode="cover"
                style={{
                  width: 60,
                  height: 60,
                  tintColor: focused ? '#99cc66' : 'black',
                }}
              />
            ),
            tabBarButton: (props, focused) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Addtab {...props} focused={focused} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="MyAdd"
          component={MyAdd}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../images/heart.png')}
                  resizeMode="cover"
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: focused ? '#99cc66' : 'black',
                  }}
                />
                <Text
                  style={{color: focused ? '#99cc66' : 'black', marginTop: 5}}>
                  MY POST
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../images/follower.png')}
                  resizeMode="cover"
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: focused ? '#99cc66' : 'black',
                  }}
                />
                <Text
                  style={{color: focused ? '#99cc66' : 'black', marginTop: 5}}>
                  PROFILE
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};
export default AllBottom;
const styles = StyleSheet.create({});
