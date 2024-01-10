import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../utils/Header';
import { fetchUser } from '../../../utils/fetchItem';
import Icon from "react-native-vector-icons/MaterialIcons"

const DashBoard: React.FC<{navigation: any}> = ({navigation}) => {
  const [rol, setRole] = useState<Number | null>(0);
  useEffect(()=>{

    const fetchId = async () =>{
      const {role} = await fetchUser()
      setRole(role)
      // console.log(role, 'id',role===4);
    }
    fetchId()
  },[])
  return (
    <>
      <Header
        title="Dashboard"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
        children={
          <TouchableOpacity onPress={() => navigation.navigate('Order Details')}>
            <View style={{marginRight: 10}}>
              <Icon name="shopping-cart" size={25} color="white" />
            </View>
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
          { rol === 3 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Punch Screen')}>
              <View>
                <Text style={styles.text}>Report</Text>
              </View>
            </TouchableOpacity>
          )

          }
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
    marginTop: '10%',
  },
  text: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#A1EEBD',
    borderRadius: 5,
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default DashBoard;
