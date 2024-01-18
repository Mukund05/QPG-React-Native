import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CustomModal from '../../utils/WarningModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {register} from '../../api/api';
import Toast from 'react-native-toast-message';

const roles = [
  {id: 3, name: 'Teacher'},
  {id: 4, name: 'Student'},
];

const SignUpScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Teacher');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    // Use Toast for error message
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      Toast.show({
        type: 'warning',
        text1: 'Please fill all the fields',
        visibilityTime: 1500,
        position: 'top',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'warning',
        text1: 'Please enter a valid email address',
        visibilityTime: 1500,
        position: 'top',
      });
      return;
    }

    try {
      console.log('Registration Data:', {
        name,
        email,
        password,
        role: selectedRole,
      });

      const response = await register({
        name,
        email,
        password,
        role: selectedRole === 'Teacher' ? 3 : 4,
      });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          visibilityTime: 1500,
          position: 'top',
        });

        setName('');
        setEmail('');
        setPassword('');
        setSelectedRole('Teacher');

        setTimeout(() => {
          navigation.navigate('LoginScreen');
        }, 2000);
      }
    } catch (error: any) {
      console.log('Register Screen', error);
      Toast.show({text1: 'Something Wrong Contact Admin', type: 'warning'});
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.item}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.action}>
          <FontAwesome name="user-o" color="#420475" style={styles.smallIcon} />
          <TextInput
            placeholder="Name"
            style={styles.textInput}
            placeholderTextColor="black"
            value={name}
            onChange={e => setName(e.nativeEvent.text)}
          />
        </View>

        <View style={styles.action}>
          <Fontisto
            name="email"
            color="#420475"
            size={24}
            style={{marginLeft: 0, paddingRight: 5}}
          />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            value={email}
            onChange={e => setEmail(e.nativeEvent.text)}
            placeholderTextColor="black"
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.textInput}
            placeholderTextColor="black"
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility}>
            <FeatherIcon
              name={showPassword ? 'eye-off' : 'eye'}
              size={25}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Picker
            selectedValue={selectedRole}
            onValueChange={itemValue => setSelectedRole(itemValue)}
            style={styles.input}>
            {roles.map(role => (
              <Picker.Item
                key={role.id}
                label={role.name}
                value={role}
                style={styles.picker}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={{color: 'black'}}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* <ToastMsg /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#89B9AD',
  },
  item: {
    marginVertical: '20%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#116A7B',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  input: {
    padding: 10,
    height: 55,
    color: 'black',
  },
  picker: {
    width: '100%',
    height: 55,
    color: 'darkgrey',
  },
  button: {
    backgroundColor: '#374259',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInLink: {
    color: '#007BFF',
    marginLeft: 5,
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
  },

  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 20,

    paddingHorizontal: 15,

    borderWidth: 1,
    borderColor: '#420475',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,

    color: '#05375a',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
});

export default SignUpScreen;
