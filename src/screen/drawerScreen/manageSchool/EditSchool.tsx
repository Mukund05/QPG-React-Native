import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import Header from '../../../utils/Header';
import {ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {fetchtoken} from '../../../utils/fetchItem';
import {editSchool} from '../../../api/api';
import {useToast} from 'react-native-toast-notifications';
import Toast from 'react-native-toast-message';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const EditSchool: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {schoolName} = route.params;
  const [formData, setFormData] = React.useState({
    name: schoolName?.name || '',
    strength: schoolName?.strength || '',
    email: schoolName?.email || '',
    person: schoolName?.person || '',
    contact_no: schoolName?.contact_no || '',
    city: schoolName?.city || '',
    state: schoolName?.state || '',
    country: schoolName?.country || '',
  });

  const toast = useToast();

  const validateEmail = (val: any) => {
    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (emailRegex.test(val)) {
      // Email is valid
      return true;
    } else {
      Toast.show({
        type: 'warning',
        text1: 'Please enter a valid email address',
        visibilityTime: 1500,
        position: 'top',
      })
      return false;
    }
  };

  const handleEditSchool = async () => {
    try {
      const token = await fetchtoken();

      // Validation: Check if required fields are not empty
      if (
        !formData?.name ||
        !formData?.strength ||
        !formData?.email ||
        !formData?.person ||
        !formData?.contact_no ||
        !formData?.city ||
        !formData?.state ||
        !formData?.country
      ) {
        // Alert if any required field is empty
        Toast.show({
          type: 'warning',
          text1: 'Please fill all the fields',
          visibilityTime: 1500,
          position: 'top',
        })
        return;
      }

      if (formData.contact_no.length !== 10) {
        Toast.show({
          type: 'warning',
          text1: 'Please enter a valid contact number',
          visibilityTime: 1500,
          position: 'top',
        })
        return;
      }

      if (!validateEmail(formData.email)) return;

      // Create FormData and append fields
      const schoolData = new FormData();
      schoolData.append('name', formData.name);
      schoolData.append('strength', formData.strength);
      schoolData.append('email', formData.email);
      schoolData.append('person', formData.person);
      schoolData.append('contact_no', formData.contact_no);
      schoolData.append('city', formData.city);
      schoolData.append('state', formData.state);
      schoolData.append('country', formData.country);

      // Send a POST request with FormData
      const response = await editSchool(token, schoolName.id, schoolData);

      console.log('EDIT::SCHOOL RESPONSE: ', response);

      // Check if the request was successful
      if (response.status) {
        // School updated successfully
        Toast.show({
          type: 'success',
          text1: 'School updated successfully',
          visibilityTime: 1500,
          position: 'top',
        })

        // You might want to navigate back to the previous screen or take any other actions
        navigation.goBack();
      } else {
        // Handle errors
        console.log('School update failed');
      }
    } catch (error) {
      console.log('EDIT::SCHOOL ERROR: ', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
        visibilityTime: 1500,
        position: 'top',
      })
    }
  };

  const handleChangeText = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <Header
        title="Edit School"
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
              value={formData.name}
              placeholder="Enter Name"
              placeholderTextColor="grey"
              keyboardType="default"
              onChangeText={text => handleChangeText('name', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Strength</Text>
            <TextInput
              style={styles.input}
              value={`${formData.strength}`}
              placeholder="Enter Strength"
              placeholderTextColor="grey"
              keyboardType="numeric"
              onChangeText={number => handleChangeText('strength', number)}
              maxLength={10}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={text => handleChangeText('email', text)}
              placeholder="Enter Email ID"
              placeholderTextColor="grey"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Person</Text>
            <TextInput
              style={styles.input}
              value={formData.person}
              onChangeText={text => handleChangeText('person', text)}
              placeholder="Enter Contact Person Name"
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact No</Text>
            <TextInput
              style={styles.input}
              value={formData.contact_no}
              onChangeText={text => handleChangeText('contact_no', text)}
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
              value={formData.city}
              onChangeText={text => handleChangeText('city', text)}
              placeholder="Enter City"
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={formData.state}
              onChangeText={text => handleChangeText('state', text)}
              placeholder="Enter State"
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={formData.country}
              onChangeText={text => handleChangeText('country', text)}
              placeholder="Enter Country"
              placeholderTextColor="grey"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomViewContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditSchool}>
          <View>
            <Text style={styles.buttonText}>UPDATE SCHOOL</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default EditSchool;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: responsiveScreenWidth(3),
    backgroundColor: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginBottom: responsiveScreenHeight(2),
  },
  label: {
    fontSize: responsiveFontSize(2.4),
    marginBottom: responsiveScreenHeight(1),
    color: 'grey',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: responsiveScreenWidth(2),
    fontSize: responsiveFontSize(2.1),
    padding: responsiveScreenWidth(2),
    color: '#000',
  },
  bottomViewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(2),
    backgroundColor: 'white',
    paddingVertical: responsiveScreenHeight(2.3),
  },
  button: {
    marginHorizontal: responsiveScreenWidth(2),
    backgroundColor: '#000',
    padding: responsiveScreenWidth(2),
    borderRadius: responsiveScreenWidth(1),
    paddingHorizontal: responsiveScreenWidth(5),
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing:1,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
