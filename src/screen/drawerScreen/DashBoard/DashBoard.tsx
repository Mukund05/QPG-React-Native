import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../utils/Header';
import {fetchUser} from '../../../utils/fetchItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import SplashScreen from 'react-native-splash-screen';
import Ripple from '../../../Animation/Ripple';

const DashBoard: React.FC<{navigation: any}> = ({navigation}) => {
  const [rol, setRole] = useState<Number | null>(0);
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1100);

    const fetchId = async () => {
      const {role} = await fetchUser();
      setRole(role);
      // console.log(role, 'id',role===4);
    };
    fetchId();
  }, []);
  return (
    <>
      <Header
        title="Dashboard"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
        children={
          <TouchableOpacity
            onPress={() => navigation.navigate('Order Details')}>
            {/* <View style={{marginRight: 10}}> */}
            <Icon
              name="shopping-cart"
              size={35}
              color="white"
              style={{marginLeft: 'auto', marginRight: responsiveWidth(2)}}
            />
            {/* </View> */}
            <Text style={styles.itemCount}>{7}</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Classes')}>
            <View>
              <Text style={styles.text}>Digital Content</Text>
            </View>
          </TouchableOpacity>
          {rol === 3 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Punch Screen')}>
              <View>
                <Text style={styles.text}>Report</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%',
  },
  text: {
    color: 'grey',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#A1EEBD',
    borderRadius: 5,
    padding: responsiveScreenHeight(2),
    borderColor: 'black',
    borderWidth: 1,
    width: '80%',
    alignItems: 'center',
    marginVertical: responsiveScreenHeight(1),
  },
  itemCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    color: 'white',
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
  },
});

export default DashBoard;
