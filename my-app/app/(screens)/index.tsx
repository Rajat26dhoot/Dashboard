import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import * as Icons from 'phosphor-react-native';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [stats, setStats] = useState<any>(null);
  const [opacity] = useState(new Animated.Value(0));

  const fetchStats = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://192.168.29.184:3000/payments/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch stats');
    }
  };

  useFocusEffect(useCallback(() => { fetchStats(); }, []));

  const chartData = stats
    ? {
        labels: Object.keys(stats.revenueLast7Days).map(date => date.slice(5)),
        datasets: [{ data: Object.values(stats.revenueLast7Days) }],
      }
    : null;

  return (
    <SafeAreaView style={styles.container}>
      {stats ? (
        <Animated.View style={[styles.content, { opacity }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>📊 Dashboard</Text>

            <MetricCard
                icon={<Icons.Bank size={32} color="#66f" weight="duotone" />}
                label="Total Revenue"
                value={`₹${stats.totalRevenue}`}
              />

            <View style={styles.row}>
              <MetricCard
                icon={<Icons.Money size={28} color="#00ffcc" weight="duotone" />}
                label="Payments       Today"
                value={stats.totalPaymentsToday}
              />
              <MetricCard
              icon={<Icons.WarningCircle size={28} color="#f66" weight="duotone" />}
              label="Failed Transactions"
              value={stats.failedTransactions}
              fullWidth
            />
              
            </View>

            

            <Text style={styles.subHeading}>Revenue (Last 7 Days)</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#1e1e1e',
                backgroundGradientTo: '#1e1e1e',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 247, 198, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#00ffcc',
                },
              }}
              bezier
              style={{ marginVertical: 12, borderRadius: 16 }}
            />
          </ScrollView>
        </Animated.View>
      ) : (
        <Text style={styles.errorText}>Loading data...</Text>
      )}
    </SafeAreaView>
  );
}

const MetricCard = ({ icon, label, value, fullWidth = false }: any) => (
  <View style={[styles.metricCard, fullWidth && { width: '100%' }]}>
    <View style={styles.metricHeader}>
      {icon}
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: '#1e1e1e',
    flex: 1,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subHeading: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});
