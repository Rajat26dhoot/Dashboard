// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel:
        route.name === 'index'
        ? 'Dashboard'
        : route.name === 'TransactionListScreen'
        ? 'Transactions'
        : route.name === 'AddPaymentScreen'
        ? 'Add Payment'
        : route.name === 'ProfileScreen'
        ? 'Profile'
        : route.name,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1e1e1e',
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'TransactionListScreen') iconName = 'list';
          else if (route.name === 'AddPaymentScreen') iconName = 'add-circle';
          else if (route.name === 'ProfileScreen') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}
