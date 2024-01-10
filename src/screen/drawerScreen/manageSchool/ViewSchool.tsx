import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useState} from 'react';
import Header from '../../../utils/Header';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {getAllSchools} from '../../../api/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import {fetchtoken} from '../../../utils/fetchItem';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';

const ViewSchool: React.FC<{navigation: any}> = ({navigation}) => {
  const [schools, setSchools] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleClick = () => {
    navigation.navigate('Add School');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSchool();
    setRefreshing(false);
  };

  const fetchSchool = async () => {
    const token = await fetchtoken();
    try {
      const response = await getAllSchools(token);
      // console.log('VIEW SCHOOL RESPONSE: ', response.data);
      setSchools(response.data);
    } catch (error) {
      console.log('VIEW SCHOOL ERROR: ', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Fetch data every time the screen is focused
      fetchSchool();
    }, [])
  );

  const handleEdit = (item: any) => {
    navigation.navigate('Edit School', {schoolName: item});
  };

  return (
    <>
      <Header
        title="View Schools"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          {schools.map((item: any) => (
            <View style={styles.card} key={item.id}>
              <Icon
                name="edit"
                size={responsiveHeight(3.0)}
                color={'green'}
                style={styles.editIcon}
                onPress={() => handleEdit(item)}
              />

              <View style={styles.schoolDetails}>
                <Text style={styles.schoolName} numberOfLines={1} ellipsizeMode={'tail'}>{item.name}</Text>
                <Text style={styles.details} numberOfLines={1} ellipsizeMode={'tail'}>{`Email: ${item.email}`}</Text>
                <Text
                  numberOfLines={1} ellipsizeMode={'tail'}
                  style={
                    styles.details
                  }>{`Contact Person: ${item.person}`}</Text>
                <Text
                  style={
                    styles.details
                  }>{`Contact No: ${item.contact_no}`}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleClick}>
          <View>
            <Text style={styles.buttonText}>Add School</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ViewSchool;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 25,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '90%',
    // height: responsiveHeight(10),
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    elevation: 5,
    flexDirection: 'column',
    paddingVertical: responsiveHeight(1.5),
  },
  editIcon: {
    position: 'absolute',
    top: responsiveHeight(1.4),
    right: responsiveHeight(1.4),
  },
  schoolDetails: {
    flex: 1,
    paddingHorizontal: 12,
  },
  schoolName: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2),
    marginBottom: 8,
    color: 'black',
    maxWidth: '80%'
    // textTransform: 'capitalize',
  },
  details: {
    fontSize: responsiveFontSize(2.2),
    color: 'black',
    marginBottom: 4,
  },
});
