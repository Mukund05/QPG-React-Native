import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile, loginUser} from '../../api/api.ts';
import {fetchUser, fetchtoken} from '../../utils/fetchItem.tsx';
import {useToast} from 'react-native-toast-notifications';
import ForgetPasswordModal from './ForgetPassword';
import {useDispatch} from 'react-redux';
import {setUser} from '../../store/Features/UserSlice.tsx';


interface RememberMeCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ checked, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.checkboxContainer, checked && styles.checked]}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>&#10003;</Text>}
      </View>
      <Text style={styles.remember}>Remember Me</Text>
    </View>
  </TouchableOpacity>
);

const LoadingIndicator: React.FC = () => (
  <View style={styles.loader}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

interface LoginFormProps {
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void;
  showPassword: boolean;
  handleTogglePasswordVisibility: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  handleTogglePasswordVisibility,
}) => (
  <>
    <View style={styles.action}>
      <FontAwesome name="user-o" color="#420475" style={styles.smallIcon} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.textInput}
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
      <TouchableOpacity
        onPress={handleTogglePasswordVisibility}
        style={styles.toggleButton}>
        <FeatherIcon
          name={showPassword ? 'eye-off' : 'eye'}
          size={25}
          color="black"
        />
      </TouchableOpacity>
    </View>
  </>
);

const LoginScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const Toast = useToast();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    //every time user restart the app we autheticate the user and token
    const checkUserCredentials = async () => {
      try {
        const token = await fetchtoken();
        const user = await fetchUser();

        if (user && token) {
          //if you have token and user in storage, still check user is valid or not
          try {
            const {id} = user as {id: number};
            const response = await getProfile(token, id);

            dispatch(setUser(response));
            navigation.reset({
              index: 0,
              routes: [{name: 'DashBoard'}],
            });
          } catch (error) {
            Alert.alert('Error', 'Invalid user credentials');
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error checking user credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    const retrieveStoredValues = async () => {
      try {
        const storedData = await fetchUser();

        if (storedData) {
          const {mail, passkey, remember} = storedData as {
            mail: string;
            passkey: string;
            remember: boolean;
          };
          setEmail(mail);
          setPassword(passkey);
          setRememberMe(remember);
        }
      } catch (error) {
        console.error('Error retrieving user credentials:', error);
      }
    };

    checkUserCredentials();
    retrieveStoredValues();
  }, []);

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Toast.show('Enter The Field Required', {
        type: 'warning',
        style: {width: '70%'},
      });
      return;
    }

    try {
      const response = await loginUser({email, password});

      if (response.status === 200) {
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            mail: email,
            passkey: password,
            remember: rememberMe,
            role: response?.data?.data?.user?.role === 'Student' ? 4 : 3,
            id: response.data.data.user.id,
          }),
        );

        await AsyncStorage.setItem('token', response?.data?.data?.token);

        Toast.show('Login Success', {
          type: 'success',
          style: {width: '70%'},
        });

        navigation.reset({
          index: 0,
          routes: [{name: 'DashBoard'}],
        });

        const userData = await getProfile(
          response?.data?.data?.token,
          response?.data?.data?.user?.id,
        );
        dispatch(setUser(userData));

        setEmail('');
        setPassword('');
        setRememberMe(false);
      }
    } catch (error) {
      Toast.show('Login Failed. Please check your credentials.', {
        type: 'error',
        style: {width: '70%'},
      });
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.item}>
        <Text style={styles.title}>Login</Text>

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          handleTogglePasswordVisibility={handleTogglePasswordVisibility}
        />

        <RememberMeCheckbox
          checked={rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignupScreen');
            }}>
            <FontAwesome
              name="user-plus"
              color="black"
              style={{fontSize: 25, alignSelf: 'center'}}
            />
            <Text style={{color: 'black'}}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orText}></View>
        <ForgetPasswordModal />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#89B9AD',
    height: '100%',
  },
  item: {
    marginVertical: '20%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#116A7B',
    textAlign: 'center',
  },
  toggleButton: {
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '30%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 5,
    marginTop: 20,
  },
  remember: {
    fontSize: 14,
    color: 'black',
    marginTop: 16,
  },
  checked: {
    borderColor: 'green',
  },
  checkmark: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 12,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 16,
    color: '#007BFF',
  },
  loginButton: {
    backgroundColor: '#374259',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  signupLink: {
    marginTop: 10,
    color: '#007BFF',
    alignSelf: 'center',
  },
  orText: {
    color: 'black',
    borderBottomColor: 'black',
    borderWidth: 1,
    width: '100%',
    marginVertical: 20,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
