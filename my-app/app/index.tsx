// app/index.tsx
import { View, Text, StyleSheet } from 'react-native';
import LoginScreen from '@/app/LoginScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral800,
  },
});
