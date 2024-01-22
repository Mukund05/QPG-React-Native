import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../utils/Header';
import {TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {addSchool} from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';
import Toast from 'react-native-toast-message';

const AddSchool: React.FC<{navigation: any}> = ({navigation}) => {
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const toast = useToast();
  const validateEmail = () => {
    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (emailRegex.test(email)) {
      // Email is valid
      return true;
    } else {
      Toast.show({
        type: 'warning',
        text1: 'Please enter a valid email address',
        visibilityTime: 1500,
        position: 'top',
      })
      return false
    }
  };

  const handleSubmit = async () => {
    if (
      name === '' ||
      strength === '' ||
      email === '' ||
      contactPerson === '' ||
      contact === '' ||
      city === '' ||
      state === '' ||
      country === ''
    ) {
      Toast.show({
        type: 'warning',
        text1: 'Please fill all the fields',
        visibilityTime: 1500,
        position: 'top',
      });
      return;
    }
    if(!validateEmail()) return;

    if(contact.length !== 10){
      toast.show('Please enter a valid contact number.', {type: 'danger'});
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('person', contactPerson);
    data.append('city', city);
    data.append('strength', strength);
    data.append('contact_no', contact);
    data.append('state', state);
    data.append('country', country);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await addSchool(token, data);
      console.log('ADD SCHOOL::RESPONSE', response);
      if (response.status) {
        Toast.show({
          type: 'success',
          text1: 'School added successfully',
          visibilityTime: 1500,
          position: 'top',
        })
        setName('');
        setStrength('');
        setEmail('');
        setContactPerson('');
        setContact('');
        setCity('');
        setState('');
        setCountry('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
        visibilityTime: 1500,
        position: 'top',
      })
      console.log('ADD SCHOOL::ERROR', error);
    }
  };

  const handleAddMore = () => {
    // console.log('add more');
    handleSubmit();
  };

  // UseEffect to load stored values when the component mounts
  useEffect(() => {
    const loadStoredValues = async () => {
      try {
        const storedSchoolData = await AsyncStorage.getItem('addedSchool');
        if (storedSchoolData) {
          const parsedData = JSON.parse(storedSchoolData);
          setName(parsedData.name);
          setStrength(parsedData.strength);
          setEmail(parsedData.email);
          setContactPerson(parsedData.contactPerson);
          setContact(parsedData.contact);
          setCity(parsedData.city);
          setState(parsedData.state);
          setCountry(parsedData.country);
        }
      } catch (error) {
        console.log('Error loading stored values:', error);
      }
    };

    loadStoredValues();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // UseEffect to update stored values whenever the input values change
  useEffect(() => {
    const updateStoredValues = async () => {
      try {
        const schoolData = {
          name,
          email,
          contactPerson,
          city,
          strength,
          contact,
          state,
          country,
        };
        await AsyncStorage.setItem('addedSchool', JSON.stringify(schoolData));
      } catch (error) {
        console.log('Error updating stored values:', error);
      }
    };

    updateStoredValues();
  }, [name, strength, email, contactPerson, contact, city, state, country]);

  return (
    <>
      <Header
        title="Add School"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.screenContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>School Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter School Name"
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Strength</Text>
            <TextInput
              style={styles.input}
              value={strength}
              onChangeText={setStrength}
              placeholder="Enter Strength"
              placeholderTextColor="grey"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email ID"
              placeholderTextColor="grey"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Person</Text>
            <TextInput
              style={styles.input}
              value={contactPerson}
              onChangeText={setContactPerson}
              placeholder="Enter Contact Person Name"
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact No</Text>
            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              placeholder="Enter Contact No."
              placeholderTextColor="grey"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter City"
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="Enter State"
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Enter Country"
              placeholderTextColor="grey"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleSubmit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Submit Details</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddMore}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add More</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AddSchool;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'grey',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    color: '#000',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
