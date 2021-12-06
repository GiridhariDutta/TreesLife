import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

export default class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: '',
      visible: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
      this.navigatePage();
    }, 3000);
  }

  navigatePage = async () => {
    //userToken = await AsyncStorage.getItem('@userToken');
    const lat = await AsyncStorage.getItem('@lat');
    const isRegister = await AsyncStorage.getItem('@user');
    const data = isRegister != null ? JSON.parse(isRegister) : null;
    const lat1 = lat != null ? JSON.parse(lat) : null;
    data === null
      ? this.props.navigation.replace('OtpSend')
      : lat1 === null
      ? this.props.navigation.replace('Location')
      : this.props.navigation.replace('AllBottom');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={80} color={'#99cc66'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
