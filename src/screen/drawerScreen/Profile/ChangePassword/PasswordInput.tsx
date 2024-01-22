import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Text} from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to install the 'expo-vector-icons' package

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = true,
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !showPassword}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={24} color="#777" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    marginBottom: responsiveScreenHeight(2.5),
  },
  label: {
    marginBottom: responsiveScreenHeight(1),
    color: '#333',
    fontSize: responsiveFontSize(2),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: responsiveScreenHeight(6),
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '90%',
    paddingHorizontal: responsiveScreenWidth(2),
    fontSize: responsiveFontSize(2),
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
});

export default PasswordInput;
