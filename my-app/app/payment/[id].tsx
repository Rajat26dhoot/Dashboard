import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bank, Calendar, CurrencyInr, IdentificationCard, CreditCard } from 'phosphor-react-native';

export default function PaymentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        const res = await axios.get(`http://192.168.29.184:3000/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayment(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPayment();
  }, [id]);

  if (!payment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.loading}>Loading payment details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Payment Details</Text>

      <View style={styles.card}>
        <View style={styles.item}>
          <CurrencyInr color="#00ffcc" size={22} weight="bold" />
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>₹{payment.amount}</Text>
        </View>

        <View style={styles.item}>
          <IdentificationCard color="#00ffcc" size={22} weight="bold" />
          <Text style={styles.label}>Receiver</Text>
          <Text style={styles.value}>{payment.receiver}</Text>
        </View>

        <View style={styles.item}>
          <Bank color="#00ffcc" size={22} weight="bold" />
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, payment.status === 'success' ? styles.success : styles.failed]}>
            {payment.status}
          </Text>
        </View>

        <View style={styles.item}>
          <CreditCard color="#00ffcc" size={22} weight="bold" />
          <Text style={styles.label}>Method</Text>
          <Text style={styles.value}>{payment.method}</Text>
        </View>

        <View style={styles.item}>
          <Calendar color="#00ffcc" size={22} weight="bold" />
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(payment.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  item: {
    marginBottom: 16,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  success: {
    color: '#00ffcc',
  },
  failed: {
    color: '#ff6b6b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loading: {
    color: '#ccc',
    marginTop: 12,
    fontSize: 16,
  },
});
