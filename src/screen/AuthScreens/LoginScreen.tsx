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
import Toast from 'react-native-toast-message';
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
interface RememberMeCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
  checked,
  onPress,
}) => (
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

  // const Toast = useToast();

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
            navigation.reset({
              index: 0,
              routes: [{name: 'LoginScreen'}],
            });
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
      Toast.show({
        type: 'warning',
        text1: 'Please fill all the fields',
        visibilityTime: 1500,
        position: 'top',
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

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          visibilityTime: 1500,
          position: 'top',
        })

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
      Toast.show({
        type: 'error',
        text1: 'Invalid Credentials',
        text2: 'Please check your email and password',
        visibilityTime: 1500,
        position: 'top',
      })
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
    paddingTop: responsiveScreenHeight(10),
    paddingHorizontal: responsiveScreenWidth(4),
    backgroundColor: '#89B9AD',
    height: '100%',
  },
  item: {
    marginVertical: responsiveScreenHeight(8),
    justifyContent: 'center',
  },
  title: {
    fontSize: responsiveFontSize(3.4),
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(3),
    color: '#116A7B',
    textAlign: 'center',
  },
  toggleButton: {
    padding: responsiveScreenHeight(1.5),
    position: 'absolute',
    right: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(2),
    width: responsiveScreenWidth(100),
  },
  checkbox: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenHeight(2.2),
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveScreenWidth(3),
    marginLeft: responsiveScreenWidth(1),
    borderRadius: 5,
    marginTop: responsiveScreenHeight(2),
  },
  remember: {
    fontSize: responsiveFontSize(1.9),
    color: 'black',
    marginTop: responsiveScreenHeight(1.7),
  },
  checked: {
    borderColor: 'green',
  },
  checkmark: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.4),
  },
  forgotPassword: {
    alignSelf: 'center',
    // marginBottom: responsiveScreenHeight(10),
    color: '#007BFF',
  },
  loginButton: {
    backgroundColor: '#374259',
    paddingVertical: responsiveScreenHeight(1.2),
    paddingHorizontal: responsiveScreenWidth(2),
    borderRadius: responsiveScreenHeight(4),
    marginBottom: responsiveScreenHeight(1.6),
    width: '100%',
    marginTop: responsiveScreenHeight(1),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(2.5),
  },
  signupLink: {
    // marginTop: responsiveScreenHeight(0),
    color: '#007BFF',
    alignSelf: 'center',
  },
  orText: {
    color: 'black',
    borderBottomColor: 'black',
    borderWidth: 1,
    width: '100%',
    marginVertical: responsiveScreenHeight(2),
  },

  action: {
    flexDirection: 'row',
    paddingTop: responsiveScreenHeight(1.5),
    paddingBottom: responsiveScreenHeight(0.5),
    marginTop: responsiveScreenHeight(2),

    paddingHorizontal: responsiveScreenWidth(4),

    borderWidth: 1,
    borderColor: '#420475',
    borderRadius: responsiveScreenHeight(5),
  },
  textInput: {
    flex: 1,
    marginTop: -responsiveScreenHeight(1),

    color: '#05375a',
  },
  smallIcon: {
    marginRight: responsiveScreenWidth(2),
    fontSize: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
