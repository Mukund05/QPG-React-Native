import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import Header from '../../../utils/Header';
import {ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {fetchtoken} from '../../../utils/fetchItem';
import {editSchool} from '../../../api/api';
import {useToast} from 'react-native-toast-notifications';

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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(val)) {
      // Email is valid
      return true;
    } else {
      toast.show('Please enter a valid email address.', {type: 'danger'});
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
        toast.show('Please fill all the fields.', {
          type: 'danger',
          style: {width: '90%'},
        });
        return;
      }

      if(formData.contact_no.length!==10) {
        toast.show('Please enter a valid contact number.', {
          type: 'danger',
          style: {width: '90%'},
        });
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
        toast.show('School updated successfully.', {
          type: 'success',
          style: {width: '90%'},
        });

        // You might want to navigate back to the previous screen or take any other actions
        navigation.goBack();
      } else {
        // Handle errors
        console.log('School update failed');
      }
    } catch (error) {
      console.log('EDIT::SCHOOL ERROR: ', error);
      toast.show('Something went wrong.', {
        type: 'danger',
        style: {width: '90%'},
      });
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
  bottomViewContainer: {
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filed: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 10,
    backgroundColor: '#1D5D9B',
    marginVertical: 5,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  textArea: {
    textAlignVertical: 'top', // This ensures the text starts from the top
    paddingTop: 10, // Adjust the padding as needed
    height: 100, // Set an initial height
    // Additional styles for the text area if needed
  },
});
