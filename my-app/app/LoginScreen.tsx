import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { colors, spacingY, spacingX } from '@/constants/theme';
import Input from '@/components/Input';
import Typo from '@/components/Typo';
import Button from '@/components/Button';
import * as Icons from 'phosphor-react-native';
import { verticalScale } from '@/utils/styling';
import { router } from 'expo-router';

export const handleLogout = async () => {
  try {
    await SecureStore.deleteItemAsync('access_token');
    router.replace('/LoginScreen');
    Alert.alert('Logged out', 'You have been successfully logged out.');
  } catch (error) {
    console.error('Logout error', error);
    Alert.alert('Error', 'Failed to logout.');
  }
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 🔒 Check if user is already logged in
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        router.replace('/(screens)');
      }
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.29.184:3000/auth/login', {
        username,
        password,
      });

      const token = response.data.access_token;
      await SecureStore.setItemAsync('access_token', token);
      router.replace('/(screens)');
      console.log('Login successful', response.data);
      Alert.alert('Success', 'Login successful!');
    } catch (error: any) {
      console.error('Login error', error);
      Alert.alert('Error', error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Typo size={30} fontWeight="800">
          Hey,
        </Typo>
        <Typo size={30} fontWeight="800">
          Welcome Back
        </Typo>
      </View>

      <View style={styles.form}>
        <Typo size={16} color={colors.textLight}>
          Login now to track all your expenses
        </Typo>

        <Input
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          icon={
            <Icons.AtIcon
              size={verticalScale(26)}
              color={colors.white}
              weight="fill"
            />
          }
        />

        <Input
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          icon={
            <Icons.LockIcon
              size={verticalScale(26)}
              color={colors.white}
              weight="fill"
            />
          }
        />

        <Typo style={{ alignSelf: 'flex-end' }} color={colors.text} size={14}>
          Forgot password?
        </Typo>

        <Button onPress={handleLogin}>
          <Typo fontWeight="700" color={colors.black} size={21}>
            Login
          </Typo>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
    backgroundColor: colors.neutral800,
  },
  welcomeContainer: {
    gap: 5,
    marginTop: spacingY._50,
  },
  form: {
    marginTop: spacingY._20,
    gap: spacingY._20,
  },
});
