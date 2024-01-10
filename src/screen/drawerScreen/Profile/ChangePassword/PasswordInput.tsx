import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Text} from 'react-native';
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
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#333',
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '90%',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
});

export default PasswordInput;
